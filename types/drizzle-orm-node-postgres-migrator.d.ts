declare module "drizzle-orm/node-postgres/migrator" {
  export type MigrationConfig = {
    migrationsFolder: string;
  };

  export type Migrate = (
    db: unknown,
    config: MigrationConfig
  ) => Promise<void>;

  export const migrate: Migrate;
}
