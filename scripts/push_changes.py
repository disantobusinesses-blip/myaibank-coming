import subprocess
import sys

try:
    # Add all changes
    subprocess.run(['git', 'add', 'app/page.tsx'], cwd='.', check=True, capture_output=True)
    print("✓ Staged changes")
    
    # Commit
    result = subprocess.run(
        ['git', 'commit', '-m', 'Update carousel: reduce to 8 banks, remove bank names'],
        cwd='.',
        capture_output=True,
        text=True
    )
    print(f"✓ Committed: {result.stdout.strip()}")
    
    # Push
    push_result = subprocess.run(
        ['git', 'push'],
        cwd='.',
        capture_output=True,
        text=True
    )
    print(f"✓ Pushed: {push_result.stdout.strip()}")
    print("SUCCESS: Changes pushed to GitHub")
    
except subprocess.CalledProcessError as e:
    print(f"Error: {e.stderr}")
    sys.exit(1)
except Exception as e:
    print(f"Error: {str(e)}")
    sys.exit(1)
