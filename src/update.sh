#!/bin/bash
cd /home/pi/black-mirror-client && unlink src/cards.json && git pull && npm install && killall electron && pm2 restart all