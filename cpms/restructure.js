const fs = require('fs');
const path = require('path');

const appDir = path.join(process.cwd(), 'apps', 'web', 'src', 'app', '(app)');
const adminDir = path.join(appDir, 'admin');

// 1. Create role folders
['admin', 'site-manager', 'vendor', 'procurement-role', 'accounts'].forEach(folder => {
  const fullPath = path.join(appDir, folder);
  if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
});

// 2. Move existing features to admin
const features = ['dashboard', 'finance', 'vendors', 'projects', 'materials', 'procurement', 'reports'];
features.forEach(feature => {
  const oldPath = path.join(appDir, feature);
  const newPath = path.join(adminDir, feature);
  if (fs.existsSync(oldPath)) {
    console.log(`Copying ${feature}...`);
    fs.cpSync(oldPath, newPath, { recursive: true });
    try {
      fs.rmSync(oldPath, { recursive: true, force: true });
    } catch (e) {
      console.error(`Failed to remove old ${feature}, continuing...`, e.message);
    }
  }
});

// Rename 'procurement-role' back to 'procurement'
const procRoleOld = path.join(appDir, 'procurement-role');
const procRoleNew = path.join(appDir, 'procurement');
if (fs.existsSync(procRoleOld)) {
  fs.cpSync(procRoleOld, procRoleNew, { recursive: true });
  try {
    fs.rmSync(procRoleOld, { recursive: true, force: true });
  } catch(e) {}
}

// Create dummy page.tsx
['site-manager', 'vendor', 'procurement', 'accounts'].forEach(folder => {
  const dashPath = path.join(appDir, folder, 'dashboard');
  if (!fs.existsSync(dashPath)) fs.mkdirSync(dashPath, { recursive: true });
  fs.writeFileSync(
    path.join(dashPath, 'page.tsx'),
    `export default function ${folder.replace(/-/g, '')}Dashboard() { return <div className="p-6"><h1>${folder} Dashboard</h1></div>; }`
  );
});

console.log('Restructure complete!');
