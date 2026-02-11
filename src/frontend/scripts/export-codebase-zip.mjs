/**
 * Export Codebase ZIP Generator
 * 
 * Creates a complete ZIP archive of the repository for self-hosting.
 * Includes frontend/, backend/, root config files, and static assets.
 * 
 * Enhanced with:
 * - Preflight validation checks
 * - Detailed error reporting with actionable messages
 * - Post-export validation (file existence, size, ZIP signature)
 * - Secondary timestamped backup artifact
 * - Improved exclusion pattern matching (supports *.log, etc.)
 */

import { createWriteStream, readFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join, relative, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');

// Output ZIP paths
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const primaryOutputPath = join(projectRoot, 'meraki-codebase-export.zip');
const secondaryOutputPath = join(projectRoot, `meraki-codebase-export-${timestamp}.zip`);

let currentOutputPath = primaryOutputPath;
let manifest = null;
let fileCount = 0;
let readmeAdded = false;
let frontendAdded = false;
let backendAdded = false;

/**
 * Preflight checks before starting export
 */
function runPreflightChecks() {
  console.log('🔍 Running preflight checks...\n');

  // Check manifest exists and is readable
  const manifestPath = join(__dirname, 'export-manifest.json');
  if (!existsSync(manifestPath)) {
    console.error('❌ PREFLIGHT FAILED: export-manifest.json not found');
    console.error(`   Expected at: ${manifestPath}`);
    console.error('   → Fix: Ensure export-manifest.json exists in frontend/scripts/');
    process.exit(1);
  }

  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    console.log('✓ Manifest loaded successfully');
  } catch (err) {
    console.error('❌ PREFLIGHT FAILED: Cannot parse export-manifest.json');
    console.error(`   Error: ${err.message}`);
    console.error('   → Fix: Ensure export-manifest.json contains valid JSON');
    process.exit(1);
  }

  // Check required directories exist
  const frontendPath = join(projectRoot, 'frontend');
  const backendPath = join(projectRoot, 'backend');

  if (!existsSync(frontendPath)) {
    console.error('❌ PREFLIGHT FAILED: frontend/ directory not found');
    console.error(`   Expected at: ${frontendPath}`);
    console.error('   → Fix: Ensure you are running this script from the project root');
    process.exit(1);
  }
  console.log('✓ frontend/ directory found');

  if (!existsSync(backendPath)) {
    console.error('❌ PREFLIGHT FAILED: backend/ directory not found');
    console.error(`   Expected at: ${backendPath}`);
    console.error('   → Fix: Ensure you are running this script from the project root');
    process.exit(1);
  }
  console.log('✓ backend/ directory found');

  // Check EXPORT_README.txt exists
  const readmePath = join(__dirname, 'EXPORT_README.txt');
  if (!existsSync(readmePath)) {
    console.warn('⚠️  WARNING: EXPORT_README.txt not found');
    console.warn(`   Expected at: ${readmePath}`);
    console.warn('   → The ZIP will be created without documentation');
  } else {
    console.log('✓ EXPORT_README.txt found');
  }

  // Check write permissions for output directory
  try {
    const testFile = join(projectRoot, '.export-test-write');
    createWriteStream(testFile).end();
    console.log('✓ Write permissions verified');
  } catch (err) {
    console.error('❌ PREFLIGHT FAILED: Cannot write to output directory');
    console.error(`   Target: ${projectRoot}`);
    console.error(`   Error: ${err.message}`);
    console.error('   → Fix: Ensure you have write permissions to the project root');
    process.exit(1);
  }

  console.log('\n✅ All preflight checks passed\n');
}

/**
 * Check if path should be excluded based on manifest patterns
 */
function shouldExclude(relativePath) {
  return manifest.exclude.some(pattern => {
    // Handle wildcard patterns like "*.log"
    if (pattern.startsWith('*')) {
      const extension = pattern.slice(1); // Remove the *
      return relativePath.endsWith(extension) || relativePath.includes(`/${pattern}`);
    }
    
    // Handle prefix patterns like "node_modules*"
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1);
      return relativePath.startsWith(prefix);
    }
    
    // Exact match or directory match
    return relativePath === pattern || relativePath.startsWith(pattern + '/');
  });
}

/**
 * Recursively add directory to archive
 */
function addDirectory(dirPath, archivePrefix = '') {
  if (!existsSync(dirPath)) {
    console.warn(`⚠️  Directory not found: ${dirPath}`);
    return;
  }

  let entries;
  try {
    entries = readdirSync(dirPath, { withFileTypes: true });
  } catch (err) {
    console.error(`❌ ERROR reading directory: ${dirPath}`);
    console.error(`   Error: ${err.message}`);
    console.error('   → Fix: Check directory permissions');
    return;
  }

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    const relativePath = relative(projectRoot, fullPath);
    const archivePath = archivePrefix ? join(archivePrefix, entry.name) : relativePath;

    // Skip excluded paths
    if (shouldExclude(relativePath)) {
      continue;
    }

    try {
      if (entry.isDirectory()) {
        addDirectory(fullPath, archivePath);
      } else if (entry.isFile()) {
        archive.file(fullPath, { name: archivePath });
        fileCount++;
      }
    } catch (err) {
      console.error(`❌ ERROR adding ${relativePath}`);
      console.error(`   Error: ${err.message}`);
      // Continue with other files instead of failing completely
    }
  }
}

/**
 * Add single file to archive
 */
function addFile(filePath, archivePath = null) {
  if (!existsSync(filePath)) {
    console.warn(`⚠️  File not found: ${filePath}`);
    return false;
  }

  try {
    const targetPath = archivePath || relative(projectRoot, filePath);
    archive.file(filePath, { name: targetPath });
    fileCount++;
    return true;
  } catch (err) {
    console.error(`❌ ERROR adding file: ${filePath}`);
    console.error(`   Error: ${err.message}`);
    return false;
  }
}

/**
 * Validate the generated ZIP file
 */
function validateZipFile(zipPath) {
  console.log('\n🔍 Validating generated ZIP file...\n');

  // Check file exists
  if (!existsSync(zipPath)) {
    console.error('❌ VALIDATION FAILED: ZIP file was not created');
    console.error(`   Expected at: ${zipPath}`);
    console.error('   → This indicates an archiver finalization error');
    return false;
  }
  console.log('✓ ZIP file exists');

  // Check file size
  const stats = statSync(zipPath);
  if (stats.size === 0) {
    console.error('❌ VALIDATION FAILED: ZIP file is empty (0 bytes)');
    console.error(`   File: ${zipPath}`);
    console.error('   → This indicates no files were added to the archive');
    return false;
  }
  console.log(`✓ ZIP file size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

  // Check ZIP signature (PK header)
  try {
    const buffer = Buffer.alloc(4);
    const fd = require('fs').openSync(zipPath, 'r');
    require('fs').readSync(fd, buffer, 0, 4, 0);
    require('fs').closeSync(fd);

    const signature = buffer.toString('hex');
    if (signature !== '504b0304') {
      console.error('❌ VALIDATION FAILED: Invalid ZIP signature');
      console.error(`   Expected: 504b0304, Got: ${signature}`);
      console.error('   → The file may be corrupted');
      return false;
    }
    console.log('✓ Valid ZIP signature (PK header)');
  } catch (err) {
    console.error('❌ VALIDATION FAILED: Cannot read ZIP signature');
    console.error(`   Error: ${err.message}`);
    return false;
  }

  // Check critical inclusions
  if (!readmeAdded) {
    console.warn('⚠️  WARNING: EXPORT_README.txt was not added to the archive');
  } else {
    console.log('✓ EXPORT_README.txt included');
  }

  if (!frontendAdded) {
    console.error('❌ VALIDATION FAILED: frontend/ directory was not added');
    return false;
  }
  console.log('✓ frontend/ directory included');

  if (!backendAdded) {
    console.error('❌ VALIDATION FAILED: backend/ directory was not added');
    return false;
  }
  console.log('✓ backend/ directory included');

  console.log(`✓ Total files included: ${fileCount}`);

  console.log('\n✅ ZIP validation passed\n');
  return true;
}

/**
 * Main export process
 */
async function exportCodebase() {
  try {
    // Run preflight checks
    runPreflightChecks();

    console.log('📦 Starting ZIP export process...\n');
    console.log(`Primary output: ${primaryOutputPath}`);
    console.log(`Secondary output: ${secondaryOutputPath}\n`);

    // Create write stream with error handling
    let output;
    try {
      output = createWriteStream(currentOutputPath);
    } catch (err) {
      console.error('❌ FATAL ERROR: Cannot create output file stream');
      console.error(`   Target: ${currentOutputPath}`);
      console.error(`   Error: ${err.message}`);
      console.error('   → Fix: Check write permissions and available disk space');
      process.exit(1);
    }

    // Create archiver instance
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    // Make archive available globally for helper functions
    global.archive = archive;

    // Handle output stream events
    output.on('close', async () => {
      console.log('\n📊 Archive Statistics:');
      console.log(`   Total size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   Files included: ${fileCount}`);
      console.log(`   Compression level: 9 (maximum)\n`);

      // Validate the generated ZIP
      const isValid = validateZipFile(currentOutputPath);

      if (!isValid) {
        console.error('\n❌ EXPORT FAILED: ZIP validation failed');
        console.error('   → Review the validation errors above');
        process.exit(1);
      }

      // Create secondary timestamped backup
      console.log('📋 Creating secondary backup...');
      try {
        const fs = require('fs');
        fs.copyFileSync(currentOutputPath, secondaryOutputPath);
        console.log(`✓ Secondary backup created: ${secondaryOutputPath}\n`);
      } catch (err) {
        console.warn('⚠️  WARNING: Could not create secondary backup');
        console.warn(`   Error: ${err.message}\n`);
      }

      console.log('✅ ═══════════════════════════════════════════════════════');
      console.log('✅ ZIP EXPORT COMPLETED SUCCESSFULLY');
      console.log('✅ ═══════════════════════════════════════════════════════\n');
      console.log('📦 Download your codebase:');
      console.log(`   Primary:   ${primaryOutputPath}`);
      console.log(`   Secondary: ${secondaryOutputPath}\n`);
      console.log('📖 The ZIP includes EXPORT_README.txt with setup instructions.\n');
    });

    output.on('error', (err) => {
      console.error('\n❌ FATAL ERROR: Output stream error');
      console.error(`   Target: ${currentOutputPath}`);
      console.error(`   Error: ${err.message}`);
      console.error('   → Fix: Check disk space and write permissions');
      process.exit(1);
    });

    // Handle archiver warnings
    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn(`⚠️  Warning: ${err.message}`);
      } else {
        console.error('\n❌ ARCHIVER WARNING (non-fatal):');
        console.error(`   Code: ${err.code}`);
        console.error(`   Message: ${err.message}`);
      }
    });

    // Handle archiver errors
    archive.on('error', (err) => {
      console.error('\n❌ FATAL ERROR: Archiver error');
      console.error(`   Code: ${err.code || 'UNKNOWN'}`);
      console.error(`   Message: ${err.message}`);
      console.error(`   Path: ${err.path || 'N/A'}`);
      console.error('   → Fix: Review the error details above');
      process.exit(1);
    });

    // Pipe archive to output
    archive.pipe(output);

    // Add EXPORT_README.txt to root
    console.log('📄 Adding documentation...');
    const readmePath = join(__dirname, 'EXPORT_README.txt');
    if (existsSync(readmePath)) {
      readmeAdded = addFile(readmePath, 'EXPORT_README.txt');
      if (readmeAdded) {
        console.log('✓ Added EXPORT_README.txt\n');
      }
    } else {
      console.warn('⚠️  EXPORT_README.txt not found, skipping\n');
    }

    // Add root-level files from manifest
    console.log('📋 Adding root-level configuration files...');
    for (const file of manifest.includeRootFiles) {
      const filePath = join(projectRoot, file);
      if (existsSync(filePath)) {
        if (addFile(filePath)) {
          console.log(`✓ Added ${file}`);
        }
      } else {
        console.warn(`⚠️  Root file not found: ${file}`);
      }
    }

    // Add frontend directory
    console.log('\n📁 Adding frontend/ directory...');
    const frontendPath = join(projectRoot, 'frontend');
    if (existsSync(frontendPath)) {
      addDirectory(frontendPath);
      frontendAdded = true;
      console.log(`✓ Added frontend/ (including public/assets)`);
    } else {
      console.error('❌ Frontend directory not found!');
      console.error('   → This should have been caught by preflight checks');
      process.exit(1);
    }

    // Add backend directory
    console.log('\n📁 Adding backend/ directory...');
    const backendPath = join(projectRoot, 'backend');
    if (existsSync(backendPath)) {
      addDirectory(backendPath);
      backendAdded = true;
      console.log(`✓ Added backend/`);
    } else {
      console.error('❌ Backend directory not found!');
      console.error('   → This should have been caught by preflight checks');
      process.exit(1);
    }

    // Finalize archive
    console.log('\n🔄 Finalizing ZIP archive...');
    console.log('   (This may take a moment for large projects)\n');
    
    try {
      await archive.finalize();
    } catch (err) {
      console.error('\n❌ FATAL ERROR: Archive finalization failed');
      console.error(`   Error: ${err.message}`);
      console.error('   → This may indicate a file access or disk space issue');
      process.exit(1);
    }

  } catch (err) {
    console.error('\n❌ FATAL ERROR: Unexpected error during export');
    console.error(`   Error: ${err.message}`);
    console.error(`   Stack: ${err.stack}`);
    console.error('   → Please report this error with the stack trace above');
    process.exit(1);
  }
}

// Run the export
exportCodebase().catch(err => {
  console.error('\n❌ UNHANDLED ERROR:');
  console.error(err);
  process.exit(1);
});
