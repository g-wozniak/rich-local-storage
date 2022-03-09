#!/bin/bash

# Version bump on the main package.json
echo ''
echo '> Version bump (patch)'
yarn version --patch
echo ''

# Copy package.json
echo ''
echo '> Copying package.json'
cp package.json ./dist/package.json
echo ''

# Copy README.md
echo ''
echo '> Copying README.md'
cp README.md ./dist/README.md
echo ''


# Updating package.json
echo ''
echo '> Updating package.json'
node ./tools/update_package.js
echo ''

# Publishing the package
echo ''
echo '> Publishing...'
cd dist && yarn deploy
echo ''