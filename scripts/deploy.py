#!/usr/bin/env python3
import subprocess
import os

os.chdir('/vercel/share/v0-project')

try:
    subprocess.run(['git', 'add', 'app/page.tsx'], check=True, capture_output=True)
    subprocess.run(['git', 'commit', '-m', 'Update carousel: reduce to 8 banks and remove names'], check=True, capture_output=True)
    subprocess.run(['git', 'push'], check=True, capture_output=True)
    print("Successfully pushed changes to GitHub")
except subprocess.CalledProcessError as e:
    print(f"Error: {e}")
