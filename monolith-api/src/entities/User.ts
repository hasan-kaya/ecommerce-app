import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

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
}
