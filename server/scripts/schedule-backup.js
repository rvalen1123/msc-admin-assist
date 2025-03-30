const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');

// Schedule backup to run daily at 2 AM
cron.schedule('0 2 * * *', () => {
  console.log('Starting scheduled database backup...');
  
  // Run the backup script
  exec('npm run db:backup', (error, stdout, stderr) => {
    if (error) {
      console.error('Backup failed:', error);
      return;
    }
    console.log('Backup completed successfully');
    console.log(stdout);
  });
});

console.log('Backup scheduler started. Will run daily at 2 AM.'); 