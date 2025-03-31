import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

const execAsync = promisify(exec);

// Load environment variables
dotenv.config({ path: '.env' });

const DATABASE_URL = process.env.DATABASE_URL;
const BACKUP_DIR = path.join(__dirname, '../backups');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

async function createBackup() {
  try {
    // Parse database URL to get connection details
    const url = new URL(DATABASE_URL);
    const dbName = url.pathname.slice(1);
    const dbHost = url.hostname;
    const dbPort = url.port;
    const dbUser = url.username;
    const dbPassword = url.password;

    // Create timestamp for backup filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(BACKUP_DIR, `backup-${timestamp}.sql`);

    // Construct pg_dump command
    const command = `PGPASSWORD="${dbPassword}" pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} -F c -f ${backupFile}`;

    // Execute backup
    await execAsync(command);
    console.log(`Backup created successfully: ${backupFile}`);

    // Clean up old backups (keep last 7 days)
    await cleanupOldBackups();
  } catch (error) {
    console.error('Backup failed:', error);
    process.exit(1);
  }
}

async function cleanupOldBackups() {
  try {
    const files = fs.readdirSync(BACKUP_DIR);
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    for (const file of files) {
      const filePath = path.join(BACKUP_DIR, file);
      const stats = fs.statSync(filePath);
      
      if (stats.mtime < sevenDaysAgo) {
        fs.unlinkSync(filePath);
        console.log(`Deleted old backup: ${file}`);
      }
    }
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
}

// Run backup
createBackup(); 