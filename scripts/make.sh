#!/bin/bash

rm -f seipp.zip
zip -r seipp.zip . -x ".git*" "scripts/*" "node_modules/*" "yarn*"
echo "Create seipp.zip"
