#!/bin/bash
cd /home/pi/black-mirror-client && git pull && npm install && killall electron && pm2 restart all