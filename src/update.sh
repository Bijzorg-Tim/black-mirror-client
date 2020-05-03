#!/bin/bash
cd /home/pi/black-mirror-client && unlink src/cards.json && git pull && killall electron && pm2 restart all