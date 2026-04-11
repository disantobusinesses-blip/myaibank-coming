import subprocess
import os

os.chdir('/vercel/share/v0-project')

subprocess.run(['git', 'add', 'app/page.tsx'], check=True)
subprocess.run(['git', 'commit', '-m', 'Remove bank names and reduce carousel to 8 banks'], check=True)
subprocess.run(['git', 'push'], check=True)

print("✓ Changes committed and pushed successfully")
