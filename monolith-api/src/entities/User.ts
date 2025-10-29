import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Cart } from './Cart';
import { Wallet } from './Wallet';
import { Order } from './Order';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255 })
  password!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts!: Cart[];

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets!: Wallet[];

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];
}
