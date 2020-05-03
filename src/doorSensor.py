import RPi.GPIO as GPIO
from time import sleep

GPIO.setmode(GPIO.BCM)

sleepTime = .1
buttonPin = 13
status = 2

GPIO.setup(buttonPin, GPIO.IN, pull_up_down=GPIO.PUD_UP)

while True:
    if (status <> GPIO.input(buttonPin)):  
        print(GPIO.input(buttonPin))
        status = GPIO.input(buttonPin)
        
    sleep(sleepTime)
