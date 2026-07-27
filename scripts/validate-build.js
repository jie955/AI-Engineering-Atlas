const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '../dist');

// Log with clean formatting
function log(msg) {
  console.log(`[Build Validator] ${msg}`);
}

function error(msg) {
  console.error(`[Build Validator] ❌ Error: ${msg}`);
}

// Recursively find all files in a directory matching a filter
function getFilesRecursively(dir, filter) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath, filter));
    } else if (!filter || filter(filePath)) {
      results.push(filePath);
    }
  }
  return results;
}

function validate() {
  log(`Starting build validation in directory: ${DIST_DIR}`);
  
  if (!fs.existsSync(DIST_DIR)) {
    error(`Output directory "${DIST_DIR}" does not exist. Please run the build process first.`);
    process.exit(1);
  }
  
  // 1. Basic structural validation
  const nextStaticDir = path.join(DIST_DIR, '_next');
  if (!fs.existsSync(nextStaticDir)) {
    error(`_next directory not found in ${DIST_DIR}. This does not look like a valid Next.js build.`);
    process.exit(1);
  }
  
  const chunksDir = path.join(DIST_DIR, '_next/static/chunks');
  if (!fs.existsSync(chunksDir)) {
    error(`Critical chunks directory "${chunksDir}" is missing.`);
    process.exit(1);
  }
  
  // 2. Scan all JS chunks to make sure we have at least some chunks
  const jsChunks = getFilesRecursively(chunksDir, (p) => p.endsWith('.js'));
  log(`Found ${jsChunks.length} JS chunk(s) in _next/static/chunks.`);
  if (jsChunks.length === 0) {
    error('No JS chunks found in the chunks directory. Build output is likely incomplete.');
    process.exit(1);
  }
  
  // Check specifically for critical next/webpack chunks
  const mainChunks = jsChunks.filter(p => p.includes('main') || p.includes('webpack') || p.includes('framework'));
  log(`Found ${mainChunks.length} critical framework/webpack/main chunk(s).`);
  if (mainChunks.length === 0) {
    error('Could not identify any critical (webpack, main, framework) JS chunks.');
    process.exit(1);
  }
  
  // 3. Find and parse all HTML files to check script references
  const htmlFiles = getFilesRecursively(DIST_DIR, (p) => p.endsWith('.html'));
  log(`Scanning ${htmlFiles.length} HTML files for script and resource resolution issues...`);
  
  let missingReferencesCount = 0;
  let totalCheckedScripts = 0;
  
  for (const htmlFile of htmlFiles) {
    const relativeHtmlPath = path.relative(DIST_DIR, htmlFile);
    const content = fs.readFileSync(htmlFile, 'utf8');
    
    // Find all src attributes on <script> tags
    const scriptSrcRegex = /<script\s+[^>]*src=["']([^"']+)["']/gi;
    // Find all href attributes on preload links for scripts
    const preloadRegex = /<link\s+[^>]*rel=["']preload["'][^>]*href=["']([^"']+\.js[^"']*)["']/gi;
    
    const references = [];
    let match;
    
    while ((match = scriptSrcRegex.exec(content)) !== null) {
      references.push({ type: 'script', url: match[1] });
    }
    
    while ((match = preloadRegex.exec(content)) !== null) {
      references.push({ type: 'preload', url: match[1] });
    }
    
    for (const ref of references) {
      const url = ref.url;
      
      // Skip external scripts
      if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
        continue;
      }
      
      totalCheckedScripts++;
      
      // Extract path, removing query strings/hashes
      const cleanPath = url.split('?')[0].split('#')[0];
      
      // Next.js uses absolute paths starting with "/" (e.g. /_next/static/chunks/...)
      // We resolve relative to the dist directory
      let resolvedPath;
      if (cleanPath.startsWith('/')) {
        resolvedPath = path.join(DIST_DIR, cleanPath.substring(1));
      } else {
        // Resolve relative to the HTML file's directory
        resolvedPath = path.resolve(path.dirname(htmlFile), cleanPath);
      }
      
      if (!fs.existsSync(resolvedPath)) {
        error(`Broken ${ref.type} reference in "${relativeHtmlPath}": "${url}" (Resolved path: "${resolvedPath}" does not exist)`);
        missingReferencesCount++;
      }
    }
  }
  
  if (missingReferencesCount > 0) {
    error(`Validation failed: Found ${missingReferencesCount} broken script reference(s) across ${htmlFiles.length} HTML pages.`);
    process.exit(1);
  }
  
  log(`✨ Validation successful: Checked ${totalCheckedScripts} script/preload references across ${htmlFiles.length} HTML file(s). All critical assets resolved correctly.`);
}

validate();
