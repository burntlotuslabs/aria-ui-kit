#!/usr/bin/env bash
# Usage: ./scripts/create-tag.sh <package-folder>     e.g. ./scripts/create-tag.sh aria-ui-kit
# Reads packages/<folder>/package.json, creates <folder>/v<version>, pushes it. The push triggers publish.
set -euo pipefail

PKG="${1:?usage: create-tag.sh <package-folder>}"
FILE="packages/$PKG/package.json"
[ -f "$FILE" ] || { echo "No $FILE" >&2; exit 1; }

VERSION=$(node -p "require('./$FILE').version")
TAG="$PKG/v$VERSION"

if [ -n "$(git status --porcelain)" ]; then echo "Working tree is dirty; commit or stash first." >&2; exit 1; fi

if git rev-parse "$TAG" >/dev/null 2>&1 || git ls-remote --exit-code --tags origin "$TAG" >/dev/null 2>&1; then
  echo "Tag $TAG already exists. If $VERSION is already on npm, bump the version instead (npm versions are immutable)." >&2
  read -r -p "Delete and recreate $TAG locally and on origin? [y/N] " ans
  [ "$ans" = "y" ] || exit 1
  git tag -d "$TAG" 2>/dev/null || true
  git push origin ":refs/tags/$TAG" 2>/dev/null || true
fi

git tag -a "$TAG" -m "$PKG $VERSION"
git push origin "$TAG"
echo "Pushed $TAG. Watch the 'Publish Package to NPM' Action."
