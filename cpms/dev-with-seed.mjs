import { spawn } from 'child_process';

// 1. Start the actual development server (turbo run dev)
const child = spawn('npx', ['turbo', 'run', 'dev'], { stdio: 'inherit', shell: true });

// 2. Poll the Next.js server until it's ready, then trigger the seed API
async function pingSeed() {
  let success = false;
  let attempts = 0;
  
  console.log('\n⏳ Waiting for the local server to start so we can auto-seed dummy users...\n');

  while (!success && attempts < 30) { // Try for up to 60 seconds
    try {
      // We ping the API route we created
      const res = await fetch('http://localhost:3000/api/seed', {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.message === "Successfully created/updated dummy credentials") {
          console.log('\n======================================================');
          console.log('✅ [AUTO-SEED SUCCESS] Dummy users have been generated!');
          console.log('You can now log in at http://localhost:3000/login');
          console.log('with credentials like: admin@cpms.com / password123');
          console.log('======================================================\n');
          success = true;
        }
      }
    } catch (e) {
      // Server not ready yet, silently ignore and wait
    }
    
    if (!success) {
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
    }
  }
}

pingSeed();

// Handle process exit cleanly
child.on('close', (code) => {
  process.exit(code);
});
process.on('SIGINT', () => {
  child.kill('SIGINT');
  process.exit();
});
process.on('SIGTERM', () => {
  child.kill('SIGTERM');
  process.exit();
});
