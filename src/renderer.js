window.fs = require('fs')
window.dirname = __dirname
window.http = require('http')
window.express = require('express')
window.Gpio = require('onoff').Gpio
window.tempsensor = require("node-dht-sensor");
window.backlight = require('rpi-backlight');
let {PythonShell} = require('python-shell')
window.PythonShell = PythonShell
let {app} = require('electron').remote
window.remote = app

