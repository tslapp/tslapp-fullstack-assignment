import { DataSource, EntityManager, EntityTarget, Repository } from 'typeorm';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';

export interface DbOptions {
  url: string;
  logging: boolean;
  entities: string[];
  migrations: string[];
}

let datasource: DataSource;

export async function initializeDb(options: DbOptions): Promise<void> {
  datasource = new DataSource({
    type: 'postgres',
    url: options.url,
    synchronize: false,
    logging: options.logging,
    entities: options.entities,
    migrations: options.migrations,
  });
  await datasource.initialize();
  await datasource.runMigrations();
}

export function getRepository<T extends ObjectLiteral>(entityClass: EntityTarget<T>): Repository<T> {
  return datasource.getRepository(entityClass);
}

export function transaction<T>(runInTransaction: (manager: EntityManager) => Promise<T>): Promise<T> {
  return datasource.transaction(runInTransaction);
}
