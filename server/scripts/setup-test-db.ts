import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import * as dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

const prisma = new PrismaClient();

async function main() {
  try {
    // Run migrations on test database
    console.log('Running migrations on test database...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });

    // Seed test database
    console.log('Seeding test database...');
    execSync('npx prisma db seed', { stdio: 'inherit' });

    console.log('Test database setup completed successfully.');
  } catch (error) {
    console.error('Error setting up test database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 