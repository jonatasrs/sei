#!/bin/bash

rm -f seipp.zip
zip -r seipp.zip . -x ".git*" ".vscode" "scripts/*" "node_modules/*"
echo "Create seipp.zip"
