#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🌟 Setting up Vedic Astrology Prediction Engine...\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error('❌ Node.js version 16 or higher is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version check passed:', nodeVersion);

// Create necessary directories
const directories = [
  'server/data',
  'server/ephemeris',
  'client/public'
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Copy environment file if it doesn't exist
const envFile = '.env';
const envExample = 'env.example';

if (!fs.existsSync(envFile) && fs.existsSync(envExample)) {
  fs.copyFileSync(envExample, envFile);
  console.log('📄 Created .env file from template');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');

try {
  console.log('Installing server dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('Installing client dependencies...');
  execSync('cd client && npm install', { stdio: 'inherit' });
  
  console.log('\n✅ All dependencies installed successfully!');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

// Create a simple start script
const startScript = `#!/bin/bash
echo "🚀 Starting Vedic Astrology Prediction Engine..."
echo "📊 Backend will run on http://localhost:5000"
echo "🌐 Frontend will run on http://localhost:3000"
echo ""
npm run dev
`;

fs.writeFileSync('start.sh', startScript);
fs.chmodSync('start.sh', '755');

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Review and edit .env file if needed');
console.log('2. Run the application: npm run dev');
console.log('3. Or use the start script: ./start.sh');
console.log('\n🌐 Access the application at:');
console.log('   Frontend: http://localhost:3000');
console.log('   Backend API: http://localhost:5000/api');
console.log('\n📚 For more information, see README.md');
