window.fs = require('fs')
window.child_process = require("child_process");
window.dirname = __dirname
window.Gpio = require('onoff').Gpio
window.tempsensor = require("node-dht-sensor");
window.backlight = require('rpi-backlight');
let {PythonShell} = require('python-shell')
window.PythonShell = PythonShell
let {app} = require('electron').remote
window.remote = app
window.mainconfig = JSON.parse(window.fs.readFileSync('../mainconfig.json'))
window.os = require('os')


