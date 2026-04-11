import subprocess
import os

os.chdir('/vercel/share/v0-project')

try:
    subprocess.run(['git', 'add', 'app/page.tsx'], check=True, capture_output=True)
    subprocess.run(['git', 'commit', '-m', 'Update carousel: reduce to 8 banks, remove bank names'], check=True, capture_output=True)
    subprocess.run(['git', 'push', 'origin', 'update-location-text'], check=True, capture_output=True)
    print('Changes committed and pushed successfully')
except subprocess.CalledProcessError as e:
    print(f'Error: {e.stderr.decode()}')
    exit(1)
