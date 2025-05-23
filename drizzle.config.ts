import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  driver: 'expo',
  dialect: 'sqlite',
});
