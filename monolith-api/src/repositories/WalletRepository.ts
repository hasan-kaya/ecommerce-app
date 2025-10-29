import { AppDataSource } from '@/config/data-source';
import { Wallet } from '@/entities/Wallet';

export class WalletRepository {
  private repository = AppDataSource.getRepository(Wallet);

  public async findByUserId(userId: string): Promise<Wallet[] | null> {
    return this.repository.find({ where: { user: { id: userId } } });
  }

  public async findByUserIdAndCurrency(
    userId: string,
    currency: string
  ): Promise<Wallet | null> {
    return this.repository.findOne({
      where: { user: { id: userId }, currency },
    });
  }

  public async createWallet(userId: string, currency: string): Promise<Wallet> {
    const wallet = this.repository.create({
      user: { id: userId },
      currency,
      balance_minor: 0,
    });
    return this.repository.save(wallet);
  }

  public async topUpWallet(
    userId: string,
    currency: string,
    amountMinor: number
  ): Promise<Wallet | null> {
    const wallet = await this.repository.findOne({
      where: { user: { id: userId }, currency },
    });
    if (!wallet) return null;

    wallet.balance_minor = Number(wallet.balance_minor) + amountMinor;
    await this.repository.save(wallet);
    return wallet;
  }
}
