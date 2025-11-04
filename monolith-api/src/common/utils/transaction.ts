import { AppDataSource } from '@/config/data-source';

// keeps services and resolvers clean from transaction management
export async function runInTransaction<T>(callback: () => Promise<T>): Promise<T> {
  return await AppDataSource.transaction(async () => {
    return callback();
  });
}
