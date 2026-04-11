#!/usr/bin/env python3
import subprocess
import os

# Change to the project directory
os.chdir('/vercel/share/v0-project')

try:
    # Add all changes
    subprocess.run(['git', 'add', 'app/page.tsx'], check=True, capture_output=True)
    
    # Commit with a message
    subprocess.run(['git', 'commit', '-m', 'Update carousel: reduce to 8 banks, remove bank names'], check=True, capture_output=True)
    
    # Push to current branch
    subprocess.run(['git', 'push', 'origin', 'HEAD'], check=True, capture_output=True)
    
    print("Successfully committed and pushed carousel changes!")
except subprocess.CalledProcessError as e:
    print(f"Error: {e}")
    print(f"stdout: {e.stdout}")
    print(f"stderr: {e.stderr}")
except Exception as e:
    print(f"Exception: {e}")
