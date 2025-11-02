import { AppError } from '@/common/middleware/error';
import { UserRepository } from '@/repositories/UserRepository';

export class AuthService {
  private userRepository = new UserRepository();

  async me(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found');
    }

    return user;
  }

  async findOrCreateOAuthUser(email: string, name?: string) {
    let user = await this.userRepository.findByEmail(email);

    if (!user) {
      user = await this.userRepository.create({
        email,
        name: name || email,
      });
    }

    return user;
  }
}
