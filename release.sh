#!/bin/bash -e

if [[ "$1" != "major" && "$1" != "minor" && "$1" != "patch" ]]; then
  echo "No semantic version specified. Use ./release.sh ( major | minor | patch)"
  exit 0
fi

# all good, update the aforementioned version
npm version $1

# push the tags to origin
git push origin --tags

# build only main index.js for npm
npm run build

# finally publish
npm publish