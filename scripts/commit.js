import { execSync } from 'child_process';

try {
  process.chdir('/vercel/share/v0-project');
  console.log('Adding changes...');
  execSync('git add -A', { stdio: 'inherit' });
  console.log('Committing...');
  execSync('git commit -m "Update location text: Remove USA countdown, update Australia message to \'Coming to Australia…then the USA…\'"', { stdio: 'inherit' });
  console.log('Pushing to update-location-text branch...');
  execSync('git push origin update-location-text', { stdio: 'inherit' });
  console.log('Successfully pushed changes to GitHub!');
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
