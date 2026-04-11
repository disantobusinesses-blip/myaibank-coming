#!/usr/bin/env python3
import subprocess
import os

os.chdir('/vercel/share/v0-project')

try:
    subprocess.run(['git', 'add', 'app/page.tsx'], check=True)
    subprocess.run(['git', 'commit', '-m', 'Remove placeholder container - logos float freely'], check=True)
    subprocess.run(['git', 'push', 'origin', 'update-location-text'], check=True)
    print("✓ Successfully pushed clean logo carousel!")
except subprocess.CalledProcessError as e:
    print(f"Git error: {e}")
except Exception as e:
    print(f"Error: {e}")
