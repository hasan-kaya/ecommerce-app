import { AppDataSource } from '@/config/data-source';
import { User } from '@/entities/User';

export class UserRepository {
  private repository = AppDataSource.getRepository(User);

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);
    return this.repository.save(user);
  }

  async count() {
    return this.repository.count();
  }
}
