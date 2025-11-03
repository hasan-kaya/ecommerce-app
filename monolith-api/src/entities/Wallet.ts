import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { Currency } from './Currency';
import { User } from './User';
import { WalletTransaction } from './WalletTransaction';

@Entity('wallets')
@Unique(['user', 'currency'])
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.wallets, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Currency, {
    nullable: false,
  })
  @JoinColumn({ name: 'currency' })
  currencyRelation!: Currency;

  @Column({ length: 3 })
  currency!: string;

  @Column('bigint', { default: 0 })
  balance_minor!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => WalletTransaction, (walletTransaction) => walletTransaction.wallet)
  transactions!: WalletTransaction[];
}
