#!/usr/bin/env python3
import subprocess
import os

os.chdir('/vercel/share/v0-project')

try:
    subprocess.run(['git', 'add', 'app/page.tsx'], check=True, capture_output=True)
    subprocess.run(['git', 'commit', '-m', 'Update carousel: 8 banks, remove names'], check=True, capture_output=True)
    result = subprocess.run(['git', 'push', 'origin', 'update-location-text'], capture_output=True, text=True)
    print("Push output:", result.stdout)
    print("Push errors:", result.stderr)
    print("Return code:", result.returncode)
except subprocess.CalledProcessError as e:
    print(f"Error: {e}")
    print(f"Output: {e.output}")
