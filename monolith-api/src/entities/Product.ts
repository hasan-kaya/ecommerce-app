import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CartItem } from './CartItem';
import { Category } from './Category';
import { Currency } from './Currency';
import { OrderItem } from './OrderItem';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255, unique: true })
  slug!: string;

  @Column('bigint', { name: 'price_minor' })
  priceMinor!: number;

  @ManyToOne(() => Currency, {
    nullable: false,
  })
  @JoinColumn({ name: 'currency' })
  currencyRelation!: Currency;

  @Column({ length: 3 })
  currency!: string;

  @Column('int', { default: 0 })
  stock_qty!: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems!: CartItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems!: OrderItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
