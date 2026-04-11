import subprocess
import os

os.chdir('/vercel/share/v0-project')

try:
    subprocess.run(['git', 'add', 'app/page.tsx'], check=True)
    subprocess.run(['git', 'commit', '-m', 'Update carousel: reduce to 8 banks and remove names'], check=True)
    subprocess.run(['git', 'push', 'origin', 'update-location-text'], check=True)
    print("Success: Changes committed and pushed to GitHub")
except Exception as e:
    print(f"Error: {e}")
