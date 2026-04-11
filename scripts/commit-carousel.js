import { execSync } from 'child_process';

try {
  execSync('git add -A', { cwd: '/vercel/share/v0-project', stdio: 'inherit' });
  execSync('git commit -m "Update carousel: reduce to 8 banks, remove bank names"', { cwd: '/vercel/share/v0-project', stdio: 'inherit' });
  execSync('git push origin update-location-text', { cwd: '/vercel/share/v0-project', stdio: 'inherit' });
  console.log('Changes committed and pushed successfully');
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
