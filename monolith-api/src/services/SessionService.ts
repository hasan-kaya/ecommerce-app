import { randomBytes } from 'crypto';

import { redisClient } from '@/config/redis';

export class SessionService {
  private readonly SESSION_PREFIX = 'session:';
  private readonly SESSION_TTL = 60 * 60 * 24 * 7; // 7 days

  async createSession(userId: string, email: string, role: string): Promise<string> {
    const sessionToken = randomBytes(32).toString('hex');
    const sessionKey = `${this.SESSION_PREFIX}${sessionToken}`;

    const sessionData = {
      userId,
      email,
      role,
      createdAt: Date.now(),
    };

    await redisClient.setEx(sessionKey, this.SESSION_TTL, JSON.stringify(sessionData));

    return sessionToken;
  }

  async getSession(sessionToken: string) {
    const sessionKey = `${this.SESSION_PREFIX}${sessionToken}`;
    const data = await redisClient.get(sessionKey);

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  }

  async deleteSession(sessionToken: string): Promise<void> {
    const sessionKey = `${this.SESSION_PREFIX}${sessionToken}`;
    await redisClient.del(sessionKey);
  }

  async refreshSession(sessionToken: string): Promise<void> {
    const sessionKey = `${this.SESSION_PREFIX}${sessionToken}`;
    await redisClient.expire(sessionKey, this.SESSION_TTL);
  }
}
