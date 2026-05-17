import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const withPublicSchema = (databaseUrl?: string) => {
  if (!databaseUrl || /[?&]schema=/.test(databaseUrl)) {
    return databaseUrl;
  }

  return `${databaseUrl}${databaseUrl.includes('?') ? '&' : '?'}schema=public`;
};

export default defineConfig({
  schema: './schema.prisma',
  migrations: {
    path: './migrations',
  },
  datasource: {
    url: withPublicSchema(process.env['DATABASE_URL']),
    shadowDatabaseUrl: withPublicSchema(process.env['SHADOW_DATABASE_URL']),
  },
});
