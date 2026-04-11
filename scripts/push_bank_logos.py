#!/usr/bin/env python3
import subprocess
import os

os.chdir('/vercel/share/v0-project')

# Stage changes
subprocess.run(['git', 'add', 'app/page.tsx'], check=True)

# Commit
subprocess.run(['git', 'commit', '-m', 'Add bank logos to carousel'], check=True)

# Push to current branch
subprocess.run(['git', 'push'], check=True)

print("Successfully pushed bank logos to carousel!")
