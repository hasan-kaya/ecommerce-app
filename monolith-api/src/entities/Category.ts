import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('categories')
export class Category{
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({unique: true, length: 255})
  slug!: string;

  @Column({length: 255})
  name!: string;
}