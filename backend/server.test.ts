// tests/setup.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT = 5432 } = process.env;

export const testPool = new Pool({
  host: PGHOST || "ep-ancient-dream-abbsot9k-pooler.eu-west-2.aws.neon.tech",
  database: 'estates_test',
  user: PGUSER || "neondb_owner",
  password: PGPASSWORD || "npg_jAS3aITLC5DX",
  port: Number(PGPORT),
  ssl: { rejectUnauthorized: false }
});

describe('Database Setup', () => {
  test('should create test pool successfully', () => {
    expect(testPool).toBeDefined();
    expect(testPool).toBeInstanceOf(Pool);
  });
});