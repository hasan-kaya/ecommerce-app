import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Category')
export class Category{
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({unique: true, length: 255})
  slug!: string;

  @Column({length: 255})
  name!: string;
}