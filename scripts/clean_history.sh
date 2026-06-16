#!/usr/bin/env bash
set -euo pipefail

# Script: clean_history.sh
# Purpose: Guide and automate cleaning secrets from git history using git-filter-repo.
# IMPORTANT: This script *does not* push changes. Run locally, verify, then follow push steps below.

if ! command -v git-filter-repo >/dev/null 2>&1; then
  echo "git-filter-repo not found. Install it first: https://github.com/newren/git-filter-repo"
  exit 1
fi

echo "*** IMPORTANT: Create a backup clone before proceeding ***"
echo "1) Make a bare backup of the repo (in case you need to restore):"
echo "   git clone --mirror <repo-url> ../fadebooker-backup-mirror"
echo
read -p "Type YES to continue and run filter-repo (will rewrite history): " confirm
if [[ "$confirm" != "YES" ]]; then
  echo "Aborting. No changes made."; exit 1
fi

# Example: remove any file named .env and remove occurrences of common secret names
echo "Running git-filter-repo to remove .env files and strings..."

git filter-repo \
  --invert-paths --paths .env \
  --replace-text <(cat <<'REPLACE'
CLOUDINARY_API_SECRET==>[REDACTED_CLOUDINARY_API_SECRET]
MP_ACCESS_TOKEN==>[REDACTED_MP_ACCESS_TOKEN]
EMAIL_PASS==>[REDACTED_EMAIL_PASS]
JWT_SECRET==>[REDACTED_JWT_SECRET]
REPLACE
)

echo "Filter-repo finished. Verify the repo, run tests, then force-push to remote when ready."
echo "To force-push (after verifying):"
echo "  git remote set-url origin <origin-url-if-needed>"
echo "  git push --force --all"
echo "  git push --force --tags"

echo "After force-push, inform collaborators to reclone or run the provided sync steps."
