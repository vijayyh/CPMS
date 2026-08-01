/// <reference types="node" />
import fs from 'fs';
import path from 'path';

const TOKENS_PATH = path.join(process.cwd(), 'design-tokens.tokens.json');

// We will output to both Web and Mobile to keep the monorepo in sync!
const WEB_CSS_OUTPUT_PATH = path.join(process.cwd(), 'apps/web/src/styles/design-tokens.css'); 
const MOBILE_CSS_OUTPUT_PATH = path.join(process.cwd(), 'apps/mobile/design-tokens.css'); 

function generateCSS() {
  console.log('🎨 Generating CSS variables from tokens...');

  if (!fs.existsSync(TOKENS_PATH)) {
    console.error('❌ tokens.json not found! Run sync-figma-tokens.ts first.');
    process.exit(1);
  }

  try {
    const rawData = fs.readFileSync(TOKENS_PATH, 'utf-8');
    const tokens = JSON.parse(rawData);

    let cssLines = [
      '/* THIS FILE IS AUTO-GENERATED FROM FIGMA EXPORT */',
      '/* DO NOT EDIT DIRECTLY. */',
      ':root {'
    ];

    // Recursive function to flatten deeply nested Figma plugin tokens
    function processTokens(obj: any, prefix = '') {
      for (const key in obj) {
        // Skip metadata added by the plugin (often starts with $)
        if (key.startsWith('$')) continue;

        const node = obj[key];
        // If we hit a node that has a 'value' property, it's a token!
        if (node && typeof node === 'object' && 'value' in node) {
          let varName = `${prefix}${key}`.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
          
          // Sanitize: replace any non-alphanumeric character (spaces, dots, etc) with hyphens
          varName = varName.replace(/[^a-z0-9-]/g, '-');
          
          // Basic check to see if value is an object (like typography) or string
          if (typeof node.value === 'string' || typeof node.value === 'number') {
            let val = node.value;
            // The plugin sometimes exports numbers for spacing without 'px', we append it if needed
            if (node.type === 'spacing' || node.type === 'sizing' || node.type === 'borderRadius' || node.type === 'fontSizes') {
               if (typeof val === 'number') val = `${val}px`;
            }
            cssLines.push(`  --${varName}: ${val};`);
          }
        } else if (node && typeof node === 'object') {
          // If it doesn't have 'value', it's a nested group, go deeper
          processTokens(node, `${prefix}${key}-`);
        }
      }
    }

    processTokens(tokens);

    cssLines.push('}');
    
    const cssContent = cssLines.join('\n');

    // --- Web Output ---
    const webOutDir = path.dirname(WEB_CSS_OUTPUT_PATH);
    if (!fs.existsSync(webOutDir)) {
      fs.mkdirSync(webOutDir, { recursive: true });
    }
    fs.writeFileSync(WEB_CSS_OUTPUT_PATH, cssContent);
    console.log(`✅ Successfully generated Web CSS at ${WEB_CSS_OUTPUT_PATH}`);

    // --- Mobile Output (NativeWind) ---
    const mobileOutDir = path.dirname(MOBILE_CSS_OUTPUT_PATH);
    if (!fs.existsSync(mobileOutDir)) {
      fs.mkdirSync(mobileOutDir, { recursive: true });
    }
    fs.writeFileSync(MOBILE_CSS_OUTPUT_PATH, cssContent);
    console.log(`✅ Successfully generated Mobile CSS at ${MOBILE_CSS_OUTPUT_PATH}`);

  } catch (error) {
    console.error('❌ Failed to generate CSS:', error);
    process.exit(1);
  }
}

generateCSS();
