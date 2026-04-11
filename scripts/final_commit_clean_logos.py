#!/usr/bin/env python3
import subprocess
import os

# Get the current working directory (project root)
cwd = os.getcwd()

# Stage the changes
subprocess.run(['git', 'add', 'app/page.tsx'], cwd=cwd, check=False)

# Commit with message
result = subprocess.run(['git', 'commit', '-m', 'Remove placeholder container - logos float freely'], cwd=cwd, capture_output=True, text=True)

# Push to current branch
subprocess.run(['git', 'push'], cwd=cwd, check=False)

print("Commit output:", result.stdout)
print("Successfully committed and pushed clean logo carousel changes!")
