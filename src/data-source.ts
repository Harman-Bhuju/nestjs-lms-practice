import { config } from "dotenv";
import { DataSource } from "typeorm";

config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_DATABASE!,
    
    // Entities
    entities: ['src/**/*.entity.ts'],

    // Migrations: IMPORTANT FOR FUTURE CHANGES!
    migrations: ['src/migrations/*.ts'],
    migrationsRun: false, // We run migrations manually
    
    logging: true, // Enable for debugging, disable for production
});

// npm run migration:run
// npm run migration:revert
// npm run migration:show

// npm run migration:create -- src/migrations/AddUsersTable
// npm run migration:generate -- src/migrations/AddUsersTable