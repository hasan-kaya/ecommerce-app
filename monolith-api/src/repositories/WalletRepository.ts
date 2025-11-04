import { AppDataSource } from '@/config/data-source';
import { Wallet } from '@/entities/Wallet';

export class WalletRepository {
  private repository = AppDataSource.getRepository(Wallet);

  public async findByUserId(userId: string): Promise<Wallet[] | null> {
    return this.repository.find({ where: { user: { id: userId } } });
  }

  public async findByUserIdAndCurrency(userId: string, currency: string): Promise<Wallet | null> {
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
    // Use atomic UPDATE to prevent race conditions
    const result = await this.repository
      .createQueryBuilder()
      .update()
      .set({ balance_minor: () => `balance_minor + ${amountMinor}` })
      .where('user_id = :userId', { userId })
      .andWhere('currency = :currency', { currency })
      .returning('*')
      .execute();

    if (result.affected === 0) return null;
    return result.raw[0];
  }

  public async deductBalance(
    userId: string,
    currency: string,
    amountMinor: number
  ): Promise<Wallet | null> {
    // Use atomic UPDATE with balance check to prevent double spend
    const result = await this.repository
      .createQueryBuilder()
      .update()
      .set({ balance_minor: () => `balance_minor - ${amountMinor}` })
      .where('user_id = :userId', { userId })
      .andWhere('currency = :currency', { currency })
      .andWhere('balance_minor >= :amountMinor', { amountMinor })
      .returning('*')
      .execute();

    if (result.affected === 0) {
      // Either wallet not found or insufficient balance
      const wallet = await this.repository.findOne({
        where: { user: { id: userId }, currency },
      });
      if (!wallet) return null;
      throw new Error(
        `Insufficient balance. Available: ${wallet.balance_minor}, Required: ${amountMinor}`
      );
    }

    return result.raw[0];
  }
}
