import { AppDataSource } from '@/config/data-source';
import { Category } from '@/entities/Category';

export class CategoryRepository {
  private repository = AppDataSource.getRepository(Category);

  async findAll() {
    return this.repository.find();
  }
}
