#!/bin/bash
cd /home/kavia/workspace/code-generation/quickplay-mini-games-6303-6313/main_container_for_quickplay_mini_games
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

