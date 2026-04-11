#!/usr/bin/env python3
import subprocess
import os

# Use current working directory
cwd = os.getcwd()

# Stage the changes
subprocess.run(['git', 'add', 'app/page.tsx'], cwd=cwd, check=True)

# Commit with message
subprocess.run(['git', 'commit', '-m', 'Remove placeholder container - logos float freely'], cwd=cwd, check=True)

# Push to current branch
subprocess.run(['git', 'push'], cwd=cwd, check=True)

print("Successfully committed and pushed clean logo carousel changes!")
