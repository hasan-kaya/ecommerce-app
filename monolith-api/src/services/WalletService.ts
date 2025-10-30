import { AppError } from '@/common/middleware/error';
import { WalletRepository } from '@/repositories/WalletRepository';

export class WalletService {
  private walletRepository = new WalletRepository();

  public async getUserWallets(userId: string) {
    return this.walletRepository.findByUserId(userId);
  }

  public async topUpUserWallet(userId: string, currency: string, amountMinor: number) {
    let wallet = await this.walletRepository.findByUserIdAndCurrency(userId, currency);
    if (!wallet) {
      wallet = await this.walletRepository.createWallet(userId, currency);
    }

    return this.walletRepository.topUpWallet(userId, currency, amountMinor);
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

  public async deductFromWallet(userId: string, currency: string, amountMinor: number) {
    const wallet = await this.walletRepository.deductBalance(userId, currency, amountMinor);
    if (!wallet) {
      throw new AppError(`Wallet not found`, 404);
    }
    return wallet;
  }
}
