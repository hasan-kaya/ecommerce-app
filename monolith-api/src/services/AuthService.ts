import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { ScopeGroups } from '@/auth/scopes';
import { parseExpiration } from '@/auth/utils/token';
import { AppError } from '@/common/middleware/error';
import { User, UserRole } from '@/entities/User';
import { UserRepository } from '@/repositories/UserRepository';

export class AuthService {
  private userRepository = new UserRepository();
  private readonly JWT_SECRET: string =
    process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
  private readonly REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

  async register(email: string, name: string, password: string) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('User already exists');
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
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
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
        throw new AppError('User not found', 404);
      }

      const tokens = this.generateTokens(user);

      return {
        user: this.sanitizeUser(user),
        ...tokens,
      };
    } catch {
      throw new AppError('Invalid refresh token');
    }
  }

  async me(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found');
    }

    return this.sanitizeUser(user);
  }

  private generateTokens(user: User) {
    const scopes = user.role === UserRole.ADMIN ? ScopeGroups.ADMIN : ScopeGroups.USER;

    const payload = {
      userId: user.id,
      email: user.email,
      scopes,
    };

    const accessToken = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign({ userId: user.id }, this.JWT_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
    } as jwt.SignOptions);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: parseExpiration(String(this.JWT_EXPIRES_IN)),
    };
  }

  private sanitizeUser(user: User) {
    const { password: _password, ...sanitized } = user;
    return sanitized;
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, this.JWT_SECRET) as {
        userId: string;
        email: string;
        scopes: string[];
      };
    } catch {
      throw new AppError('Invalid token');
    }
  }
}
