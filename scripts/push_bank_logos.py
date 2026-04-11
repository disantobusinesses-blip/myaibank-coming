#!/usr/bin/env python3
import subprocess
import os

# Use current working directory (project root)
cwd = os.getcwd()

# Stage changes
subprocess.run(['git', 'add', 'app/page.tsx'], cwd=cwd, check=True)

# Commit
subprocess.run(['git', 'commit', '-m', 'Add bank logos to carousel'], cwd=cwd, check=True)

# Push to current branch
subprocess.run(['git', 'push'], cwd=cwd, check=True)

print("Successfully pushed bank logos to carousel!")
