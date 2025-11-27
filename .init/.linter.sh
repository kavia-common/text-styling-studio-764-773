#!/bin/bash
cd /tmp/kavia/workspace/code-generation/text-styling-studio-764-773/text_formatter_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

