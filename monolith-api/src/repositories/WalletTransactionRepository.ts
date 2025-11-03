import { Repository } from 'typeorm';

import { AppDataSource } from '../config/data-source';
import { WalletTransaction, TransactionType } from '../entities/WalletTransaction';

export class WalletTransactionRepository {
  private repository: Repository<WalletTransaction>;

  constructor() {
    this.repository = AppDataSource.getRepository(WalletTransaction);
  }

  async createTransaction(
    walletId: string,
    type: TransactionType,
    amountMinor: number,
    currency: string,
    description?: string,
    relatedTransactionId?: string
  ): Promise<WalletTransaction> {
    const transaction = this.repository.create({
      wallet: { id: walletId },
      type,
      amount_minor: amountMinor,
      currency,
      description,
      relatedTransactionId,
    });

    return this.repository.save(transaction);
  }

  async findByWalletIdPaginated(
    walletId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<[WalletTransaction[], number]> {
    return this.repository.findAndCount({
      where: { wallet: { id: walletId } },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }
}
