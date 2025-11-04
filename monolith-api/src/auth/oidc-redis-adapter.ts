import { redisClient } from '@/config/redis';

const grantable = new Set([
  'AccessToken',
  'AuthorizationCode',
  'RefreshToken',
  'DeviceCode',
  'BackchannelAuthenticationRequest',
]);

export class RedisAdapter {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  key(id: string) {
    return `oidc:${this.name}:${id}`;
  }

  async destroy(id: string) {
    const key = this.key(id);
    await redisClient.del(key);
  }

  async consume(id: string) {
    const key = this.key(id);
    const data = await redisClient.get(key);
    if (!data) return;

    const payload = JSON.parse(data);
    payload.consumed = Math.floor(Date.now() / 1000);
    await redisClient.set(key, JSON.stringify(payload));
  }

  async find(id: string) {
    const key = this.key(id);
    const data = await redisClient.get(key);
    if (!data) return undefined;

    return JSON.parse(data);
  }

  async findByUserCode(userCode: string) {
    const key = `oidc:userCode:${userCode}`;
    const id = await redisClient.get(key);
    if (!id) return undefined;

    return this.find(id);
  }

  async findByUid(uid: string) {
    const key = `oidc:uid:${uid}`;
    const id = await redisClient.get(key);
    if (!id) return undefined;

    return this.find(id);
  }

  async upsert(id: string, payload: any, expiresIn: number) {
    const key = this.key(id);

    if (expiresIn) {
      await redisClient.setEx(key, expiresIn, JSON.stringify(payload));
    } else {
      await redisClient.set(key, JSON.stringify(payload));
    }

    if (grantable.has(this.name) && payload.grantId) {
      const grantKey = `oidc:grant:${payload.grantId}`;
      await redisClient.rPush(grantKey, key);
    }

    if (payload.userCode) {
      const userCodeKey = `oidc:userCode:${payload.userCode}`;
      await redisClient.set(userCodeKey, id);
    }

    if (payload.uid) {
      const uidKey = `oidc:uid:${payload.uid}`;
      await redisClient.set(uidKey, id);
    }
  }

  async revokeByGrantId(grantId: string) {
    const grantKey = `oidc:grant:${grantId}`;
    const tokens = await redisClient.lRange(grantKey, 0, -1);

    for (const token of tokens) {
      await redisClient.del(token);
    }

    await redisClient.del(grantKey);
  }
}
