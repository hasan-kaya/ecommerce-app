import { WalletRepository } from '@/repositories/WalletRepository';

export class WalletService {
  private walletRepository = new WalletRepository();

  public async getUserWallets(userId: string) {
    return this.walletRepository.findByUserId(userId);
  }

  public async topUpUserWallet(
    userId: string,
    currency: string,
    amountMinor: number
  ) {
    let wallet = await this.walletRepository.findByUserIdAndCurrency(
      userId,
      currency
    );
    if (!wallet) {
      wallet = await this.walletRepository.createWallet(userId, currency);
    }

    return this.walletRepository.topUpWallet(userId, currency, amountMinor);
  }
}
