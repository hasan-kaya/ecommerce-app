import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { User } from './User';

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

  @Column({ length: 3 })
  currency!: string;

  @Column('bigint', { default: 0 })
  balance_minor!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
