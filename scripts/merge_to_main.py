#!/usr/bin/env python3
import subprocess
import os

# Get the current working directory
cwd = os.getcwd()

# Fetch latest changes from remote
subprocess.run(['git', 'fetch', 'origin'], cwd=cwd, check=False)

# Switch to main branch
subprocess.run(['git', 'checkout', 'main'], cwd=cwd, check=False)

# Pull latest main
subprocess.run(['git', 'pull', 'origin', 'main'], cwd=cwd, check=False)

# Merge update-location-text branch into main
subprocess.run(['git', 'merge', 'update-location-text', '-m', 'Merge carousel and location updates to main'], cwd=cwd, check=False)

# Push to main
subprocess.run(['git', 'push', 'origin', 'main'], cwd=cwd, check=False)

print("Merged update-location-text to main branch!")
