
const tempsensor = require("node-dht-sensor");


tempsensor.read(22, 21, function(err, temperature, humidity) {
    console.log('error: ' + err)
    console.log('temperature: ' + temperature)
    console.log('humidity: ' + humidity)
})