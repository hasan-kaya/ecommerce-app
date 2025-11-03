import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('currencies')
export class Currency {
  @PrimaryColumn({ unique: true, length: 3 })
  code!: string;

  @Column({ type: 'numeric', precision: 18, scale: 4 })
  rate!: number;
}
