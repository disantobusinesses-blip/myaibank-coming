#!/usr/bin/env python3
import subprocess

subprocess.run(['git', 'add', '.'], check=True)
subprocess.run(['git', 'commit', '-m', 'Remove placeholder container - logos float freely'], check=True)
subprocess.run(['git', 'push'], check=True)

print("Pushed clean logo carousel!")
