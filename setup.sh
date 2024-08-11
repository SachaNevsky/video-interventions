#!/usr/bin/env bash

# Creates a new .env file and creates the NEXT_PUBLIC_WS_IP environmental variable

# Create the .env file and 
touch .env && > .env

echo "Checking IP address..."

if [ "$(uname)" == "Darwin" ]; then
    echo NEXT_PUBLIC_WS_IP=$(ipconfig getifaddr en0) >> .env
elif [ $(expr substr $(uname -s) 1 10) == "MINGW64_NT" ]; then
    echo NEXT_PUBLIC_WS_IP=$(ipconfig | grep 'IPv4' | cut -d ':' -f2 | grep '192' | sed -e 's/^[ \t]*//') >> .env
fi

echo "Installing required NPM packages..."
npm install

echo ""
echo "Script finished"
echo ""
echo "Check the IP environment:"
cat .env
