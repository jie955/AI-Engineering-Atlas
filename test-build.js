const { execSync } = require('child_process');
try {
  execSync('npx next build', { stdio: 'inherit' });
  console.log("SUCCESS");
} catch (e) {
  console.log("FAILED");
}
