#!/usr/bin/env bash
# Automated Git Submodule Sparse-Checkout Setup Script for products-md
# Configures strict non-cone sparse checkout to pull ONLY the singular `product/` folder
# and exclude all root-level codebase files (like package.json, src/, etc.).
# Usage: ./scripts/setup-submodules.sh <repo-name> <git-url>

set -e

REPO_NAME=$1
GIT_URL=$2

if [ -z "$REPO_NAME" ] || [ -z "$GIT_URL" ]; then
  echo "Usage: ./scripts/setup-submodules.sh <repo-name> <git-url>"
  echo "Example: ./scripts/setup-submodules.sh ously-core git@github.com:fromsukong/ously-core.git"
  exit 1
fi

TARGET_DIR="repos/$REPO_NAME"

echo "--> Adding submodule '$REPO_NAME'..."
if [ ! -d "$TARGET_DIR" ]; then
  git submodule add "$GIT_URL" "$TARGET_DIR"
fi

echo "--> Setting strict non-cone sparse-checkout for '$TARGET_DIR' (ONLY singular product/ folder)..."
cd "$TARGET_DIR"
git sparse-checkout disable || true
git sparse-checkout init --no-cone
git sparse-checkout set "product/*" "product/**"
git read-tree -mu HEAD || true
cd - > /dev/null

echo "--> Success! '$REPO_NAME' submodule configured with strict sparse-checkout (product/ folder only)."
