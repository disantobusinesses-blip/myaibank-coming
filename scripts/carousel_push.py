#!/usr/bin/env python3
import subprocess
import os

# Change to project directory
os.chdir("/vercel/share/v0-project")

# Stage all changes
subprocess.run(["git", "add", "app/page.tsx"], check=True)

# Commit the changes
subprocess.run(["git", "commit", "-m", "Update carousel: reduce to 8 banks, remove bank names"], check=True)

# Push to the current branch
subprocess.run(["git", "push", "origin", "HEAD"], check=True)

print("Successfully pushed carousel changes to GitHub!")
