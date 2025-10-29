import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from './Product';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 255 })
  slug!: string;

  @Column({ length: 255 })
  name!: string;

  @OneToMany(() => Product, (product) => product.category)
  products!: Product[];
}
