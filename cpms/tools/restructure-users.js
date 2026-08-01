const fs = require('fs');
const path = require('path');

const appDir = path.join(process.cwd(), 'apps', 'web', 'src', 'app', '(app)');
const userTypeDir = path.join(appDir, '(user-types)');

if (!fs.existsSync(userTypeDir)) {
  fs.mkdirSync(userTypeDir, { recursive: true });
}

const roles = ['admin', 'site-manager', 'vendor', 'procurement', 'accounts', 'employee'];

roles.forEach(role => {
  const oldPath = path.join(appDir, role);
  const newPath = path.join(userTypeDir, role);
  
  if (fs.existsSync(oldPath)) {
    console.log(`Moving ${role}...`);
    fs.cpSync(oldPath, newPath, { recursive: true });
    try {
      fs.rmSync(oldPath, { recursive: true, force: true });
    } catch(e) {
      console.log(`Could not delete original ${role}, you may need to delete it manually.`, e.message);
    }
  }
});

console.log('UserTypes group created!');
