#!/usr/bin/env python3
import subprocess
import os

cwd = os.getcwd()

subprocess.run(['git', 'add', 'app/page.tsx'], cwd=cwd, check=True)
subprocess.run(['git', 'commit', '-m', 'Make carousel background transparent'], cwd=cwd, check=True)
subprocess.run(['git', 'push'], cwd=cwd, check=True)

print("Pushed transparent background changes!")
