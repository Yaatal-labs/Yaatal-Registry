import fs from 'fs';
import path from 'path';

const DIST_DIR = './dist';
const ASSETS_DIR = path.join(DIST_DIR, 'assets');

function runSmoke() {
  console.log('--- Starting Production Build Smoke Test ---');
  let failures = 0;

  // 1. Check if dist directory exists
  if (!fs.existsSync(DIST_DIR)) {
    console.error('✗ ERROR: "dist" folder does not exist. Did you run "npm run build" first?');
    failures++;
    process.exit(1);
  }
  console.log('✓ Success: "dist" directory exists.');

  // 2. Check if index.html exists and is valid
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('✗ ERROR: "dist/index.html" is missing.');
    failures++;
  } else {
    const htmlContent = fs.readFileSync(indexPath, 'utf-8');
    if (!htmlContent.includes('<div id="root"></div>')) {
      console.error('✗ ERROR: "dist/index.html" is missing the React root div.');
      failures++;
    } else if (!htmlContent.includes('/assets/index-')) {
      console.error('✗ ERROR: "dist/index.html" is missing asset script/css tags.');
      failures++;
    } else {
      console.log('✓ Success: "dist/index.html" is structurally valid.');
    }
  }

  // 3. Scan assets
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error('✗ ERROR: "dist/assets" directory is missing.');
    failures++;
  } else {
    const files = fs.readdirSync(ASSETS_DIR);
    const jsFile = files.find(f => f.startsWith('index-') && f.endsWith('.js'));
    const cssFile = files.find(f => f.startsWith('index-') && f.endsWith('.css'));

    if (!jsFile) {
      console.error('✗ ERROR: Main JS bundle is missing from assets.');
      failures++;
    } else {
      const jsPath = path.join(ASSETS_DIR, jsFile);
      const jsContent = fs.readFileSync(jsPath, 'utf-8');
      
      // Look for minification-safe string literals in our code
      const hasSupabaseTable = jsContent.includes('translation_corrections');
      const hasPlaygroundTitle = jsContent.includes('Model Playground & Feedback Loop') || jsContent.includes('Playground du Modèle');
      
      if (!hasSupabaseTable) {
        console.error('✗ ERROR: Supabase feedback table symbol ("translation_corrections") is missing from the compiled bundle.');
        failures++;
      } else if (!hasPlaygroundTitle) {
        console.error('✗ ERROR: Playground title string is missing from the compiled bundle.');
        failures++;
      } else {
        console.log(`✓ Success: Main JS bundle (${jsFile}) contains translation playground and Supabase table keys.`);
      }
    }

    if (!cssFile) {
      console.error('✗ ERROR: Main CSS bundle is missing from assets.');
      failures++;
    } else {
      console.log(`✓ Success: Main CSS bundle (${cssFile}) exists.`);
    }
  }

  console.log('--------------------------------------------');
  if (failures === 0) {
    console.log('⚡ SMOKE TEST PASSED: Build is 100% stable and ready to deploy!');
    process.exit(0);
  } else {
    console.error(`✗ SMOKE TEST FAILED: Encountered ${failures} compilation/structural errors.`);
    process.exit(1);
  }
}

runSmoke();
