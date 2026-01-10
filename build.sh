#!/bin/bash

# Compiles zips that are compatible with Google and Firefox extension distribution 

# Extension version
VER=$(grep '"version"' manifest.json | sed 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')

echo "Building zips for version $VER"

# Create dist folder if it doesn't exist
mkdir -p dist

# Browsers to build
for BROWSER in firefox chrome; do
    ZIPFILE="dist/${BROWSER}-${VER}.zip"
    
    # Remove old zip if it exists
    [ -f "$ZIPFILE" ] && rm "$ZIPFILE"
    
    # Zip everything into the dist folder
    zip -vr "$ZIPFILE" css js icons manifest.json
done