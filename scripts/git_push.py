#!/usr/bin/env python3
import subprocess
import os

os.chdir('/vercel/share/v0-project')

try:
    subprocess.run(['git', 'add', 'app/page.tsx'], check=True)
    subprocess.run(['git', 'commit', '-m', 'Update carousel: reduce to 8 banks, remove names'], check=True)
    subprocess.run(['git', 'push', 'origin', 'update-location-text'], check=True)
    print("Changes committed and pushed successfully!")
except subprocess.CalledProcessError as e:
    print(f"Error: {e}")
