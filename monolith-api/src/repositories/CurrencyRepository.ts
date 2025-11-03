import { AppDataSource } from '@/config/data-source';
import { Currency } from '@/entities/Currency';

export class CurrencyRepository {
  private repository = AppDataSource.getRepository(Currency);

  public async findAll(): Promise<Currency[]> {
    return this.repository.find();
  }
}
