#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

SOURCE_BRANCH="master"
TARGET_BRANCH="gh-pages"

#Pull requests and commits to other branches shouldn't try to deploy, just build to verify
if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "$SOURCE_BRANCH" ]; then
    echo "Skipping deploy; just doing a build."
    npm run lint
    npm run build
    npm run build-examples
    echo "All good!"
    exit 0
 fi

# Save some useful information
REPO=`git config remote.origin.url`
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
SHA=`git rev-parse --verify HEAD`

# Clone the existing gh-pages for this repo into lib/
# Create a new empty branch if gh-pages doesn't exist yet (should only happen on first deply)
git clone $REPO lib
cd lib
git checkout $TARGET_BRANCH || git checkout --orphan $TARGET_BRANCH
cd ..

# Clean out existing contents
rm -rf lib/**/* || exit 0

# Run our compile script
npm run build-examples

# Now let's go have some fun with the cloned repo
cd lib
git config user.name "Travis CI"
git config user.email "ankeet.maini@gmail.com"

# Commit the "changes", i.e. the new version.
# The delta will show diffs between new and old versions.
git add -A
git commit -m "Deploy to GitHub Pages: ${SHA}"

# Get the deploy key by using Travis's stored variables to decrypt deploy_key.enc
ENCRYPTED_KEY_VAR="encrypted_${ENCRYPTION_LABEL}_key"
ENCRYPTED_IV_VAR="encrypted_${ENCRYPTION_LABEL}_iv"
ENCRYPTED_KEY=${!ENCRYPTED_KEY_VAR}
ENCRYPTED_IV=${!ENCRYPTED_IV_VAR}
openssl aes-256-cbc -K $ENCRYPTED_KEY -iv $ENCRYPTED_IV -in ../portal_deploy_key.enc -out ./portal_deploy_key -d
chmod 600 portal_deploy_key
eval `ssh-agent -s`
ssh-add portal_deploy_key

# Now that we're all set up, we can push.
git push $SSH_REPO $TARGET_BRANCH