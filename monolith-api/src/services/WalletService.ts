import { AppError } from '@/common/middleware/error';
import { TransactionType } from '@/entities/WalletTransaction';
import { CurrencyRepository } from '@/repositories/CurrencyRepository';
import { WalletRepository } from '@/repositories/WalletRepository';
import { WalletTransactionRepository } from '@/repositories/WalletTransactionRepository';

export class WalletService {
  private walletRepository = new WalletRepository();
  private currencyRepository = new CurrencyRepository();
  private transactionRepository = new WalletTransactionRepository();

  public async getUserWallets(userId: string) {
    return this.walletRepository.findByUserId(userId);
  }

  public async getWalletTransactions(
    userId: string,
    currency: string,
    page: number = 1,
    pageSize: number = 50
  ) {
    // Find user's wallet by currency
    const wallet = await this.walletRepository.findByUserIdAndCurrency(userId, currency);

    if (!wallet) {
      throw new AppError(`Wallet not found for currency: ${currency}`, 404);
    }

    const offset = (page - 1) * pageSize;
    const [transactions, total] = await this.transactionRepository.findByWalletIdPaginated(
      wallet.id,
      pageSize,
      offset
    );

    return {
      transactions,
      total,
      page,
      pageSize,
      hasMore: offset + transactions.length < total,
    };
  }

  public async createInitialWallets(userId: string) {
    const currencies = await this.currencyRepository.findAll();

    const walletPromises = currencies.map((currency) =>
      this.walletRepository.createWallet(userId, currency.code)
    );

    await Promise.all(walletPromises);
  }

  public async topUpUserWallet(
    userId: string,
    currency: string,
    amountMinor: number,
    description?: string
  ) {
    let wallet = await this.walletRepository.findByUserIdAndCurrency(userId, currency);
    if (!wallet) {
      wallet = await this.walletRepository.createWallet(userId, currency);
    }

    const updatedWallet = await this.walletRepository.topUpWallet(userId, currency, amountMinor);
    if (!updatedWallet) {
      throw new AppError('Failed to top up wallet', 500);
    }

    await this.transactionRepository.createTransaction(
      wallet.id,
      TransactionType.TOP_UP,
      amountMinor,
      currency,
      description || `Top up ${currency} wallet`
    );

    return updatedWallet;
  }

  public async checkBalance(userId: string, currency: string, requiredAmountMinor: number) {
    const wallet = await this.walletRepository.findByUserIdAndCurrency(userId, currency);

    if (!wallet) {
      throw new AppError(`You don't have a ${currency} wallet`, 404);
    }

    if (wallet.balance_minor < requiredAmountMinor) {
      throw new AppError('Insufficient balance', 400);
    }
  }

  public async deductFromWallet(
    userId: string,
    currency: string,
    amountMinor: number,
    type: TransactionType = TransactionType.PURCHASE,
    description?: string
  ) {
    const walletBefore = await this.walletRepository.findByUserIdAndCurrency(userId, currency);
    if (!walletBefore) {
      throw new AppError(`Wallet not found`, 404);
    }

    const wallet = await this.walletRepository.deductBalance(userId, currency, amountMinor);
    if (!wallet) {
      throw new AppError(`Failed to deduct balance`, 500);
    }

    await this.transactionRepository.createTransaction(
      walletBefore.id,
      type,
      amountMinor,
      currency,
      description || `Deduct from ${currency} wallet`
    );

    return wallet;
  }

  private async convertCurrency(
    amountMinor: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> {
    if (fromCurrency === toCurrency) {
      return amountMinor;
    }

    const fromCurrencyData = await this.currencyRepository.findByCode(fromCurrency);
    const toCurrencyData = await this.currencyRepository.findByCode(toCurrency);

    if (!fromCurrencyData || !toCurrencyData) {
      throw new AppError('Currency not found', 404);
    }

    // Convert to base currency (TRY) first, then to target currency
    const amountInBaseCurrency = amountMinor / Number(fromCurrencyData.rate);
    const convertedAmount = amountInBaseCurrency * Number(toCurrencyData.rate);

    return Math.round(convertedAmount);
  }

  public async transferBetweenWallets(
    userId: string,
    fromCurrency: string,
    toCurrency: string,
    amountMinor: number
  ) {
    const fromWallet = await this.walletRepository.findByUserIdAndCurrency(userId, fromCurrency);
    if (!fromWallet) {
      throw new AppError(`Source wallet not found`, 404);
    }

    let toWallet = await this.walletRepository.findByUserIdAndCurrency(userId, toCurrency);
    if (!toWallet) {
      toWallet = await this.walletRepository.createWallet(userId, toCurrency);
    }

    // Check balance
    await this.checkBalance(userId, fromCurrency, amountMinor);

    // Convert currency
    const convertedAmount = await this.convertCurrency(amountMinor, fromCurrency, toCurrency);

    // Deduct from source wallet
    await this.walletRepository.deductBalance(userId, fromCurrency, amountMinor);

    // Add to destination wallet with converted amount
    await this.walletRepository.topUpWallet(userId, toCurrency, convertedAmount);

    // Create TRANSFER_OUT transaction for source wallet
    const transferOutTransaction = await this.transactionRepository.createTransaction(
      fromWallet.id,
      TransactionType.TRANSFER_OUT,
      amountMinor,
      fromCurrency,
      `Transfer to ${toCurrency} wallet (${amountMinor} ${fromCurrency} → ${convertedAmount} ${toCurrency})`
    );

    // Create TRANSFER_IN transaction for destination wallet
    await this.transactionRepository.createTransaction(
      toWallet.id,
      TransactionType.TRANSFER_IN,
      convertedAmount,
      toCurrency,
      `Transfer from ${fromCurrency} wallet (${amountMinor} ${fromCurrency} → ${convertedAmount} ${toCurrency})`,
      transferOutTransaction.id
    );

    return {
      fromWallet: await this.walletRepository.findByUserIdAndCurrency(userId, fromCurrency),
      toWallet: await this.walletRepository.findByUserIdAndCurrency(userId, toCurrency),
      convertedAmount,
    };
  }
}
