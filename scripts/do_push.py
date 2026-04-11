#!/usr/bin/env python3
import subprocess
import os

os.chdir('/vercel/share/v0-project')

# Stage and commit carousel changes
subprocess.run(['git', 'add', 'app/page.tsx'], check=True)
subprocess.run(['git', 'commit', '-m', 'Update carousel: 8 banks, remove names'], check=True)
subprocess.run(['git', 'push', 'origin', 'update-location-text'], check=True)

print("✓ Changes pushed to GitHub")
