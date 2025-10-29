import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '@/entities/User';
import { UserRepository } from '@/repositories/UserRepository';

export class AuthService {
  private userRepository = new UserRepository();
  private readonly JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  private readonly JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '24h';
  private readonly REFRESH_TOKEN_EXPIRES_IN: string = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

  async register(email: string, name: string, password: string) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    const tokens = this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const tokens = this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, this.JWT_SECRET) as { userId: string };
      
      const user = await this.userRepository.findById(decoded.userId);
      if (!user) {
        throw new Error('User not found');
      }

      const tokens = this.generateTokens(user);
      
      return {
        user: this.sanitizeUser(user),
        ...tokens,
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async me(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return this.sanitizeUser(user);
  }

  private generateTokens(user: User) {
    const payload = { userId: user.id, email: user.email };
    
    const accessToken: string = (jwt.sign as Function)(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN
    });
    
    const refreshToken: string = (jwt.sign as Function)({ userId: user.id }, this.JWT_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRES_IN
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: this.parseExpiration(this.JWT_EXPIRES_IN),
    };
  }

  private sanitizeUser(user: User) {
    const { password, ...sanitized } = user;
    return sanitized;
  }

  private parseExpiration(exp: string): number {
    const unit = exp.slice(-1);
    const value = parseInt(exp.slice(0, -1));
    
    switch (unit) {
      case 'h': return value * 3600;
      case 'd': return value * 86400;
      case 'm': return value * 60;
      default: return 3600;
    }
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, this.JWT_SECRET) as { userId: string; email: string };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
