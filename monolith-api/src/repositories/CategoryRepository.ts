import { AppDataSource } from '@/config/data-source';
import { Category } from '@/entities/Category';

export class CategoryRepository {
  private repository = AppDataSource.getRepository(Category);

  async findAll() {
    return this.repository.find();
  }

  async findWithPagination(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const [categories, total] = await this.repository.findAndCount({
      skip,
      take: pageSize,
      order: { name: 'ASC' },
    });

    return {
      categories,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  async findBySlug(slug: string) {
    return this.repository.findOne({ where: { slug } });
  }

  async create(data: { name: string; slug: string }) {
    const category = this.repository.create(data);
    return this.repository.save(category);
  }

  async update(id: string, data: { name: string; slug: string }) {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string) {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
