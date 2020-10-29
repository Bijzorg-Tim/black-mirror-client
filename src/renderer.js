window.fs = require('fs')
window.child_process = require("child_process");
window.dirname = __dirname
let {PythonShell} = require('python-shell')
window.PythonShell = PythonShell
let {app} = require('electron').remote
window.remote = app
window.os = require('os')
window.RPiMfrc522 = require('rpi-mfrc522');
window.Gpio = require('onoff').Gpio
window.tempsensor = require("node-dht-sensor");
window.backlight = require('rpi-backlight');

