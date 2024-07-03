#!/usr/bin/env bash

# Creates a new .env file and creates the NEXT_PUBLIC_WS_IP environmental variable

touch .env && > .env && echo NEXT_PUBLIC_WS_IP=$(ipconfig | grep 'IPv4' | cut -d ':' -f2 | grep '192' | sed -e 's/^[ \t]*//') >> .env && npm install