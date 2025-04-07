// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DataSource } = require('typeorm');

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'dummy',
  password: 'dummy',
  database: 'tslapp-fullstack-assignment',
  entities: [
    'dist/entity/*.js'
  ],
  migrations: [
    'dist/migration/*.js'
  ],
  cli: {
    migrationsDir: 'src/migration'
  }
});

module.exports = {
  default: dataSource,
};
