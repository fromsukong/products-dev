#!/usr/bin/env bash
# Automated Git Submodule Sync & Push Script for products-dev
# Iterates through all submodules, commits any untracked/modified changes,
# pushes each submodule to its remote GitHub repository, and updates main repo submodule references.
# Usage: ./scripts/push-submodules.sh [commit-message]

set -e

COMMIT_MSG="${1:-docs: update product spec files}"

echo "========================================"
echo "🚀 Syncing & Pushing All Submodules..."
echo "========================================"

# Make sure we are in the repository root directory
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

SUBMODULES=("products" repos/*)

for sub in "${SUBMODULES[@]}"; do
  if [ ! -d "$sub/.git" ] && [ ! -f "$sub/.git" ]; then
    continue
  fi

  echo ""
  echo "----------------------------------------"
  echo "Processing submodule: $sub"
  echo "----------------------------------------"

  (
    cd "$sub"

    # Convert HTTPS remote URL to SSH if needed
    remote_url=$(git remote get-url origin 2>/dev/null || echo "")
    if [[ "$remote_url" =~ ^https://github\.com/([^/]+)/(.+)\.git$ ]]; then
      owner="${BASH_REMATCH[1]}"
      repo="${BASH_REMATCH[2]}"
      ssh_url="git@github.com:${owner}/${repo}.git"
      echo "--> Switching remote URL to SSH: $ssh_url"
      git remote set-url origin "$ssh_url"
    fi

    # Check for uncommitted or untracked changes
    if [ -n "$(git status --porcelain)" ]; then
      echo "--> Staging changes in $sub..."
      git add .
      git commit -m "$COMMIT_MSG"
      echo "--> Pushing $sub to remote main..."
      git push origin HEAD:main
    else
      echo "--> No changes in $sub to commit."
    fi
  )
done

echo ""
echo "========================================"
echo "📌 Updating Main Repository Submodule Pointers..."
echo "========================================"

cd "$REPO_ROOT"

# Check if main repository has updated submodule pointers or modified files
if [ -n "$(git status --porcelain)" ]; then
  echo "--> Staging submodule pointer updates in main repository..."
  git add .
  git commit -m "chore: update submodule commit references"
  echo "--> Pushing main repository to remote..."
  git push origin HEAD:main
  echo "--> Main repository updated and pushed successfully!"
else
  echo "--> Main repository is already up to date."
fi

echo ""
echo "========================================"
echo "✅ All submodules and main repository synced & pushed!"
echo "========================================"

