#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const ROOT_DIR = path.resolve(__dirname, '..');
const SERVER_DIR = path.join(ROOT_DIR, 'server');
const FRONTEND_DIST_DIR = path.join(ROOT_DIR, 'dist');
const SERVER_DIST_DIR = path.join(SERVER_DIR, 'dist');
const SERVER_PUBLIC_DIR = path.join(SERVER_DIST_DIR, 'public');

// ANSI colors for output
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

/**
 * Executes a shell command and prints output
 */
function execute(command, cwd = ROOT_DIR) {
  console.log(`${COLORS.cyan}> ${command}${COLORS.reset}`);
  try {
    execSync(command, { 
      cwd, 
      stdio: 'inherit', 
      env: { ...process.env, FORCE_COLOR: true } 
    });
    return true;
  } catch (error) {
    console.error(`${COLORS.red}Command failed: ${command}${COLORS.reset}`);
    return false;
  }
}

/**
 * Main build function
 */
async function build() {
  console.log(`\n${COLORS.bright}${COLORS.green}=== MSC Admin Portal Production Build ===${COLORS.reset}\n`);

  // Step 1: Install dependencies if needed
  console.log(`\n${COLORS.yellow}=== Installing Dependencies ===${COLORS.reset}`);
  
  if (!execute('npm ci')) {
    console.log(`${COLORS.yellow}Falling back to npm install...${COLORS.reset}`);
    execute('npm install');
  }
  
  if (!execute('npm ci', SERVER_DIR)) {
    console.log(`${COLORS.yellow}Falling back to npm install...${COLORS.reset}`);
    execute('npm install', SERVER_DIR);
  }

  // Step 2: Build frontend
  console.log(`\n${COLORS.yellow}=== Building Frontend ===${COLORS.reset}`);
  if (!execute('npm run build')) {
    console.error(`${COLORS.red}Frontend build failed!${COLORS.reset}`);
    process.exit(1);
  }

  // Step 3: Build backend
  console.log(`\n${COLORS.yellow}=== Building Backend ===${COLORS.reset}`);
  if (!execute('npm run build', SERVER_DIR)) {
    console.error(`${COLORS.red}Backend build failed!${COLORS.reset}`);
    process.exit(1);
  }

  // Step 4: Generate Prisma client
  console.log(`\n${COLORS.yellow}=== Generating Prisma Client ===${COLORS.reset}`);
  if (!execute('npm run prisma:generate', SERVER_DIR)) {
    console.error(`${COLORS.red}Prisma client generation failed!${COLORS.reset}`);
    process.exit(1);
  }

  // Step 5: Copy frontend build to server's public directory for production serving
  console.log(`\n${COLORS.yellow}=== Copying Frontend to Backend ===${COLORS.reset}`);
  
  // Create public directory if it doesn't exist
  if (!fs.existsSync(SERVER_PUBLIC_DIR)) {
    fs.mkdirSync(SERVER_PUBLIC_DIR, { recursive: true });
    console.log(`Created directory: ${SERVER_PUBLIC_DIR}`);
  }
  
  // Copy frontend build to server's public directory
  if (fs.existsSync(FRONTEND_DIST_DIR)) {
    execute(`xcopy "${FRONTEND_DIST_DIR}" "${SERVER_PUBLIC_DIR}" /E /I /Y`);
    console.log(`${COLORS.green}Frontend build copied to: ${SERVER_PUBLIC_DIR}${COLORS.reset}`);
  } else {
    console.error(`${COLORS.red}Frontend build directory not found: ${FRONTEND_DIST_DIR}${COLORS.reset}`);
    process.exit(1);
  }

  // Step 6: Create a production deployment package
  console.log(`\n${COLORS.yellow}=== Creating Deployment Package ===${COLORS.reset}`);
  
  // Create a package.json for production
  const serverPackageJson = JSON.parse(
    fs.readFileSync(path.join(SERVER_DIR, 'package.json'), 'utf8')
  );
  const productionPackageJson = {
    name: 'msc-admin-assist',
    version: serverPackageJson.version,
    private: true,
    scripts: {
      start: 'node dist/main.js',
      prisma: 'prisma',
    },
    dependencies: {},
    engines: {
      node: '>=18.0.0'
    }
  };
  
  // Copy only production dependencies
  if (serverPackageJson.dependencies) {
    productionPackageJson.dependencies = Object.entries(serverPackageJson.dependencies)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
  }
  
  // Write the production package.json
  fs.writeFileSync(
    path.join(SERVER_DIST_DIR, 'package.json'),
    JSON.stringify(productionPackageJson, null, 2)
  );
  
  // Copy Prisma files
  execute(`xcopy "${SERVER_DIR}\\prisma" "${SERVER_DIST_DIR}\\prisma" /E /I /Y`);
  
  // Copy production env file if it exists
  if (fs.existsSync(path.join(SERVER_DIR, '.env.production'))) {
    fs.copyFileSync(
      path.join(SERVER_DIR, '.env.production'),
      path.join(SERVER_DIST_DIR, '.env')
    );
  }
  
  console.log(`\n${COLORS.bright}${COLORS.green}=== Build Complete ===${COLORS.reset}`);
  console.log(`\nProduction build is available in: ${SERVER_DIST_DIR}`);
  console.log(`\nTo start the production server:`);
  console.log(`${COLORS.cyan}cd ${SERVER_DIST_DIR}`);
  console.log(`npm ci --production`);
  console.log(`npm start${COLORS.reset}`);
}

// Run the build
build().catch(err => {
  console.error(`${COLORS.red}Build failed:${COLORS.reset}`, err);
  process.exit(1);
});
