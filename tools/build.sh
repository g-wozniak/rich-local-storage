#!/bin/bash

# Remove outdated build directory
echo ''
echo '> Removing previous build (if exists)'
yarn rimraf dist
echo ''

# Transpile to TypeScript
echo ''
echo '> Transpilation...'
yarn tsc
echo ''
