#!/usr/bin/env python3
import subprocess
import os

# Git add, commit, and push from current working directory
subprocess.run(['git', 'add', '.'], check=True)
subprocess.run(['git', 'commit', '-m', 'Make carousel background transparent'], check=True)
subprocess.run(['git', 'push'], check=True)

print("Pushed transparent background changes!")
