#!/usr/bin/env python
import time
import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522

reader = SimpleMFRC522()

try:
    while(1 > 0):
        id, text = reader.read()
        print(id)
        time.sleep(3)
finally:
        GPIO.cleanup()
