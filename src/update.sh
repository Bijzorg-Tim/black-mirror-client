#!/bin/bash
cd /home/pi/black-mirror-client && unlink src/cards.json && git pull && npm install && sudo reboot now