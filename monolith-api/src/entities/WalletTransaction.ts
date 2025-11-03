import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Wallet } from './Wallet';

export enum TransactionType {
  TOP_UP = 'top_up',
  TRANSFER_IN = 'transfer_in',
  TRANSFER_OUT = 'transfer_out',
  PURCHASE = 'purchase',
}

@Entity('wallet_transactions')
@Index(['wallet', 'createdAt'])
export class WalletTransaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'wallet_id' })
  wallet!: Wallet;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type!: TransactionType;

  @Column('bigint', { default: 0 })
  amount_minor!: number;

  @Column({ length: 3 })
  currency!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid', nullable: true, name: 'related_transaction_id' })
  relatedTransactionId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
