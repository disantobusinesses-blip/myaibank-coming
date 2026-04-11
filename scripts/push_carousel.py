import subprocess
import os

os.chdir("/vercel/share/v0-project")

# Configure git
subprocess.run(["git", "config", "user.email", "v0[bot]@users.noreply.github.com"], check=False)
subprocess.run(["git", "config", "user.name", "v0[bot]"], check=False)

# Add changes
subprocess.run(["git", "add", "app/page.tsx"], check=True)

# Commit
subprocess.run(["git", "commit", "-m", "Update carousel: reduce to 8 banks and remove bank names"], check=True)

# Push
result = subprocess.run(["git", "push", "origin", "update-location-text"], capture_output=True, text=True)
print(result.stdout)
print(result.stderr)
