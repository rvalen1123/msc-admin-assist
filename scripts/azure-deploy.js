#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get equivalent of __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration - Update these values with your Azure details
const AZURE_RESOURCE_GROUP = 'msc-wound-care';
const AZURE_APP_SERVICE_NAME = 'msc-wound-care-app';
const AZURE_SQL_SERVER_NAME = 'med-exchange-2';
const AZURE_SQL_DB_NAME = 'msc';
const AZURE_SQL_ADMIN_USER = 'mscwoundadmin';
const AZURE_SQL_ADMIN_PASSWORD = process.env.AZURE_SQL_ADMIN_PASSWORD || 'B@xter1123$$!';

// ANSI colors for output
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

// Directories
const ROOT_DIR = path.resolve(__dirname, '..');
const SERVER_DIST_DIR = path.join(ROOT_DIR, 'server', 'dist');
const DEPLOYMENT_ZIP_PATH = path.join(ROOT_DIR, 'deployment.zip');

/**
 * Executes a shell command and prints output
 */
function execute(command, cwd = ROOT_DIR) {
  console.log(`${COLORS.cyan}> ${command}${COLORS.reset}`);
  try {
    return execSync(command, { 
      cwd, 
      stdio: 'inherit', 
      env: { 
        ...process.env, 
        FORCE_COLOR: true,
        PATH: process.env.PATH + ";C:\\Program Files\\Microsoft SDKs\\Azure\\CLI2\\wbin" 
      } 
    });
  } catch (error) {
    console.error(`${COLORS.red}Command failed: ${command}${COLORS.reset}`);
    throw error;
  }
}

/**
 * Validates Azure CLI is installed and logged in
 */
function validateAzureCliLogin() {
  console.log(`\n${COLORS.yellow}=== Checking Azure CLI Installation ===${COLORS.reset}`);
  try {
    execSync('az --version', { 
      stdio: 'ignore',
      env: { 
        ...process.env, 
        PATH: process.env.PATH + ";C:\\Program Files\\Microsoft SDKs\\Azure\\CLI2\\wbin" 
      }
    });
    console.log('Azure CLI is installed.');
  } catch (error) {
    console.error(`${COLORS.red}Azure CLI is not installed or not in PATH. Please install it:${COLORS.reset}`);
    console.error('https://docs.microsoft.com/en-us/cli/azure/install-azure-cli');
    process.exit(1);
  }
  
  // Check login status
  console.log('Checking Azure CLI login status...');
  try {
    execSync('az account show', { 
      stdio: 'ignore',
      env: { 
        ...process.env, 
        PATH: process.env.PATH + ";C:\\Program Files\\Microsoft SDKs\\Azure\\CLI2\\wbin" 
      }
    });
    console.log('Already logged in to Azure CLI.');
  } catch (error) {
    console.error(`${COLORS.red}Not logged in to Azure CLI. Please run:${COLORS.reset}`);
    console.error('az login');
    process.exit(1);
  }

  // Check resource group
  try {
    console.log(`\n${COLORS.yellow}=== Checking Resource Group ===${COLORS.reset}`);
    const resourceGroupId = '/subscriptions/b2e37fe8-2019-4e9a-bf45-548e174a4b21/resourceGroups/msc-wound-care';
    execSync(`az group show --ids "${resourceGroupId}"`, { stdio: 'ignore' });
    console.log(`Resource group ${AZURE_RESOURCE_GROUP} exists.`);
  
  // Check SQL server
  try {
    execSync(`az sql server show --name ${AZURE_SQL_SERVER_NAME} --resource-group ${AZURE_RESOURCE_GROUP}`, { stdio: 'ignore' });
    console.log(`SQL Server ${AZURE_SQL_SERVER_NAME} exists.`);
  
  // Check SQL database
  try {
    execSync(`az sql db show --name ${AZURE_SQL_DB_NAME} --server ${AZURE_SQL_SERVER_NAME} --resource-group ${AZURE_RESOURCE_GROUP}`, { stdio: 'ignore' });
    console.log(`SQL Database ${AZURE_SQL_DB_NAME} exists.`);
  } catch (error) {
    console.error(`${COLORS.red}SQL Database ${AZURE_SQL_DB_NAME} not found. Please create it first.${COLORS.reset}`);
    process.exit(1);
  }
  
  // Check App Service
  try {
    execSync(`az webapp show --name ${AZURE_APP_SERVICE_NAME} --resource-group ${AZURE_RESOURCE_GROUP}`, { stdio: 'ignore' });
    console.log(`App Service ${AZURE_APP_SERVICE_NAME} exists.`);
  } catch (error) {
    console.error(`${COLORS.red}App Service ${AZURE_APP_SERVICE_NAME} not found. Please create it first.${COLORS.reset}`);
    process.exit(1);
  }

/**
 * Update App Service settings
 */
function updateAppSettings() {
  console.log(`\n${COLORS.yellow}=== Updating App Service Settings ===${COLORS.reset}`);
  
  const connectionString = `sqlserver://${AZURE_SQL_SERVER_NAME}.database.windows.net:1433;database=${AZURE_SQL_DB_NAME};user=${AZURE_SQL_ADMIN_USER};password=${AZURE_SQL_ADMIN_PASSWORD};encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;`;
  
  execute(`az webapp config appsettings set --name ${AZURE_APP_SERVICE_NAME} --resource-group ${AZURE_RESOURCE_GROUP} --settings NODE_ENV=production PORT=8080 AZURE_SQL_CONNECTION_STRING="${connectionString}" AZURE_SQL_SHADOW_CONNECTION_STRING="${connectionString}"`);
}

/**
 * Packages the application for deployment
 */
function packageApplication() {
  console.log(`\n${COLORS.yellow}=== Packaging Application for Deployment ===${COLORS.reset}`);
  
  // Check if deployment directory exists
  if (!fs.existsSync(SERVER_DIST_DIR)) {
    console.error(`${COLORS.red}Deployment directory not found: ${SERVER_DIST_DIR}${COLORS.reset}`);
    console.error('Run npm run build:production first');
    process.exit(1);
  }
  
  // Create deployment zip
  console.log('Creating deployment zip file...');
  
  // Remove old zip if exists
  if (fs.existsSync(DEPLOYMENT_ZIP_PATH)) {
    fs.unlinkSync(DEPLOYMENT_ZIP_PATH);
  }
  
  // Create zip
  execute(`cd "${SERVER_DIST_DIR}" && powershell Compress-Archive -Path * -DestinationPath "${DEPLOYMENT_ZIP_PATH}"`);
  console.log(`Deployment package created: ${DEPLOYMENT_ZIP_PATH}`);
}

/**
 * Deploys the application to Azure
 */
function deployApplication() {
  console.log(`\n${COLORS.yellow}=== Deploying Application to Azure ===${COLORS.reset}`);
  
  // Check if zip file exists
  if (!fs.existsSync(DEPLOYMENT_ZIP_PATH)) {
    console.error(`${COLORS.red}Deployment package not found: ${DEPLOYMENT_ZIP_PATH}${COLORS.reset}`);
    process.exit(1);
  }
  
  // Deploy to Azure
  console.log('Deploying to Azure App Service...');
  execute(`az webapp deployment source config-zip --name ${AZURE_APP_SERVICE_NAME} --resource-group ${AZURE_RESOURCE_GROUP} --src "${DEPLOYMENT_ZIP_PATH}"`);
  
  // Restart the app
  console.log('Restarting App Service...');
  execute(`az webapp restart --name ${AZURE_APP_SERVICE_NAME} --resource-group ${AZURE_RESOURCE_GROUP}`);
}

/**
 * Main deployment function
 */
async function deploy() {
  console.log(`\n${COLORS.bright}${COLORS.green}=== MSC Admin Portal Azure Deployment ===${COLORS.reset}\n`);
  
  try {
    validateAzureCliLogin();
    verifyResources();
    updateAppSettings();
    packageApplication();
    deployApplication();
    
    console.log(`\n${COLORS.bright}${COLORS.green}=== Deployment Complete ===${COLORS.reset}`);
    console.log(`\nYour application is deployed at: https://${AZURE_APP_SERVICE_NAME}.azurewebsites.net`);
     }