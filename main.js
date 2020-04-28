const child_process = require("child_process");
const os = require('os')
const fs = require('fs')
const mainconfig = JSON.parse(fs.readFileSync(__dirname + '/mainconfig.json'))
const axios = require('axios')
const app = require('express')();
const server = require('http').Server(app);
const bodyParser = require('body-parser');

const setupDevice = function (mainconfig) {
    const pin = Math.floor(Math.random() * 1000000)
    const ip = os.networkInterfaces()[mainconfig.interface_name][0].address
    const tempconfig = {
        pin: pin,
        ip: ip
    }

    axios({
        url: 'http://' + mainconfig.api_url + ':' + mainconfig.api_port + '/device-needs-setup',
        method: 'POST',
        data: tempconfig,
      }).then(() => {

      }).catch(() => {

      })

    fs.writeFileSync(__dirname + '/src/tempconfig.json', JSON.stringify(tempconfig))
}

//copy to directory below to make available to electron
child_process.exec("cp " + mainconfig.black_mirror_location + "/mainconfig.json " + mainconfig.black_mirror_location + "/src/mainconfig.json", function(err, stdout,stderr){});

const startElectron = function (mainconfig, arguments) {
    if (arguments === undefined) {
        child_process.exec("cd " + mainconfig.black_mirror_location + " && export DISPLAY=:0 && npm start" , function(err, stdout,stderr){});
    } else {
        child_process.exec("cd " + mainconfig.black_mirror_location + " && export DISPLAY=:0 && " + arguments , function(err, stdout,stderr){});
    }
}

const killElectron = function () {
    child_process.exec("killall electron" , function(err, stdout,stderr){});
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
server.listen(mainconfig.client_server_port)

if (fs.existsSync('./src/deviceconfig.json')) {
    startElectron(mainconfig)
} 

else {
    setupDevice(mainconfig)
    startElectron(mainconfig)
}


app.get('/deleteconfig', function (req, res) {
    killElectron()

    if (fs.existsSync('./src/deviceconfig.json')) {

        config = JSON.parse(fs.readFileSync('./src/deviceconfig.json'))
        
        axios({
            url: 'http://' + mainconfig.api_url + ':' + mainconfig.api_port + '/device-deleting-config',
            method: 'POST',
            data: config,
        }).then(() => {})
        .catch(() => {})

        fs.unlinkSync('./src/deviceconfig.json')
    }
    
    
    if (fs.existsSync('./src/tempconfig.json')) {
        fs.unlinkSync('./src/tempconfig.json') 
    }
    setupDevice(mainconfig)
    startElectron(mainconfig)
    res.send('delete config')
})

app.get('/updatesoftware', function (req, res) {
    startElectron(mainconfig, "git pull && npm install && killall electron && pm2 restart all")
    
    res.send()
});

app.get('/restartapp', function (req, res) {
    child_process.exec("pm2 restart all" , function(err, stdout,stderr){});

    res.send()
});

app.get('/reboot', function (req, res) {
    child_process.exec("sudo reboot now" , function(err, stdout,stderr){});

    res.send()
});

app.get('/shutdown', function (req, res) {
    child_process.exec("sudo shutdown" , function(err, stdout,stderr){});

    res.send()
});

app.post('/updateconfig', function (req, res) {
    killElectron()
    
    if (req.body.uuid) {
        if (fs.existsSync('./src/deviceconfig.json')) {
            fs.unlinkSync('./src/deviceconfig.json') 
        }
        if (fs.existsSync('./src/tempconfig.json')) {
            fs.unlinkSync('./src/tempconfig.json') 
        }
        fs.writeFileSync('./src/deviceconfig.json', JSON.stringify(req.body))
        deviceconfig = JSON.parse(fs.readFileSync('./src/deviceconfig.json', 'utf8'));
    }
    startElectron(mainconfig) 
    res.send()
})




    //kill all electrons
//         child_process.exec("killall electron" , function(err, stdout,stderr){});
//         if (req.method === 'POST') {
//             let body = '';
//             req.on('data', chunk => {
//                 body += chunk;
//             });
//             req.on('end', () => {
//                 if (fs.existsSync('./src/deviceconfig.json')) {
//                    fs.unlinkSync('./src/deviceconfig.json') 
//                 }
//                 if (fs.existsSync('./src/tempconfig.json')) {
//                     fs.unlinkSync('./src/tempconfig.json') 
//                 }
//                 fs.writeFileSync('./src/deviceconfig.json', body)
//                 deviceconfig = JSON.parse(fs.readFileSync('./src/deviceconfig.json', 'utf8'));

//                 //change ip
                
//                 // var interface = {
//                 //     interface: mainconfig.interface_name,
//                 //     ip_address: deviceconfig.ip,
//                 //     prefix: deviceconfig.prefix,
//                 //     gateway: deviceconfig.gateway,
//                 //     nameservers: [deviceconfig.dns]
//                 // }

//                 // set_ip_address.configure([interface])
//                 child_process.exec("sudo cp /etc/dhcpcd.conf /etc/dhcpcd_old.conf", function(err, stdout,stderr){});
//                 child_process.exec("sudo echo 'interface '" + mainconfig.interface_name + " >> /etc/dhcpcd.conf" , function(err, stdout,stderr){});
//                 child_process.exec("sudo echo 'static ip_address='" + deviceconfig.ip + "'/'" + deviceconfig.prefix + " >> /etc/dhcpcd.conf" , function(err, stdout,stderr){});
//                 child_process.exec("sudo echo 'static routers='" + deviceconfig.gateway + " >> /etc/dhcpcd.conf" , function(err, stdout,stderr){});
//                 child_process.exec("sudo echo 'static domain_name_servers='" + deviceconfig.dns + " >> /etc/dhcpcd.conf" , function(err, stdout,stderr){});



//                 //change hostname
//                 console.log(deviceconfig.room.slug)
//                 // child_process.exec("sudo hostnamectl set-hostname " + deviceconfig.room.slug, function(err, stdout,stderr){});
//                 // child_process.exec("sudo sed -i 's/" + os.hostname + "/" + deviceconfig.room.slug + "/g /etc/hosts", function(err, stdout,stderr){});

//                 child_process.exec("sudo reboot now", function(err, stdout,stderr){});


//             });

//             //change ip

//             //change hostname
//         } 





//     const data = JSON.stringify({
//         pin: pin,
//         ip: ip
//       })
      
//       const options = {
//         hostname: mainconfig.api_url,
//         port: mainconfig.api_port,
//         path: '/device-needs-setup',
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Content-Length': data.length
//         }
//       }
      
//       const req = http.request(options, res => {
//         console.log(`statusCode: ${res.statusCode}`)
      
//         res.on('data', d => {
//           process.stdout.write(d)
//         })
//       })
      
//       req.on('error', error => {
//         console.error(error)
//       })
      
//       req.write(data)
//       req.end()
// }

// http.createServer(function (req, res) {
//     if (req.url === "/on") {
//         //kill all apps to avoid duplicates
//         child_process.exec("killall electron" , function(err, stdout,stderr){});
//         //start main app
//         child_process.exec("cd " + mainconfig.black_mirror_location + " && npm start" , function(err, stdout,stderr){});
//     }
//     if (req.url === "/ping") {
//       res.write('pong')
//     }
//     if (req.url === "/off") {
//         //kill all electrons
//         child_process.exec("killall electron" , function(err, stdout,stderr){});
//     }
//     if (req.url === "/shutdown") {
//         //kill all electrons
//         child_process.exec("sudo shutdown now" , function(err, stdout,stderr){});
//     }
//     if (req.url === "/updatesoftware") {
//         //kill all electrons
//         child_process.exec("killall electron" , function(err, stdout,stderr){});
//         child_process.exec("cd /home/pi/Desktop/black-mirror-client/ && git pull && npm install" , function(err, stdout,stderr){});
//         child_process.exec("sudo reboot now" , function(err, stdout,stderr){});
//     }
//     if (req.url === "/reboot") {
//         //kill all electrons
//         child_process.exec("sudo reboot now" , function(err, stdout,stderr){});
//     }
//     if (req.url === "/deleteconfig") {
//         child_process.exec("killall electron" , function(err, stdout,stderr){});
//         if (fs.existsSync('./src/deviceconfig.json')) {
//             fs.unlinkSync('./src/deviceconfig.json') 
//         }
//         child_process.exec("sudo reboot now" , function(err, stdout,stderr){});
//     }
//     if (req.url === "/updateconfig") {
//         //kill all electrons
//         child_process.exec("killall electron" , function(err, stdout,stderr){});
//         if (req.method === 'POST') {
//             let body = '';
//             req.on('data', chunk => {
//                 body += chunk;
//             });
//             req.on('end', () => {
//                 if (fs.existsSync('./src/deviceconfig.json')) {
//                    fs.unlinkSync('./src/deviceconfig.json') 
//                 }
//                 if (fs.existsSync('./src/tempconfig.json')) {
//                     fs.unlinkSync('./src/tempconfig.json') 
//                 }
//                 fs.writeFileSync('./src/deviceconfig.json', body)
//                 deviceconfig = JSON.parse(fs.readFileSync('./src/deviceconfig.json', 'utf8'));

//                 //change ip
                
//                 // var interface = {
//                 //     interface: mainconfig.interface_name,
//                 //     ip_address: deviceconfig.ip,
//                 //     prefix: deviceconfig.prefix,
//                 //     gateway: deviceconfig.gateway,
//                 //     nameservers: [deviceconfig.dns]
//                 // }

//                 // set_ip_address.configure([interface])
//                 child_process.exec("sudo cp /etc/dhcpcd.conf /etc/dhcpcd_old.conf", function(err, stdout,stderr){});
//                 child_process.exec("sudo echo 'interface '" + mainconfig.interface_name + " >> /etc/dhcpcd.conf" , function(err, stdout,stderr){});
//                 child_process.exec("sudo echo 'static ip_address='" + deviceconfig.ip + "'/'" + deviceconfig.prefix + " >> /etc/dhcpcd.conf" , function(err, stdout,stderr){});
//                 child_process.exec("sudo echo 'static routers='" + deviceconfig.gateway + " >> /etc/dhcpcd.conf" , function(err, stdout,stderr){});
//                 child_process.exec("sudo echo 'static domain_name_servers='" + deviceconfig.dns + " >> /etc/dhcpcd.conf" , function(err, stdout,stderr){});



//                 //change hostname
//                 console.log(deviceconfig.room.slug)
//                 // child_process.exec("sudo hostnamectl set-hostname " + deviceconfig.room.slug, function(err, stdout,stderr){});
//                 // child_process.exec("sudo sed -i 's/" + os.hostname + "/" + deviceconfig.room.slug + "/g /etc/hosts", function(err, stdout,stderr){});

//                 child_process.exec("sudo reboot now", function(err, stdout,stderr){});


//             });

//             //change ip

//             //change hostname
//         } 
//     }
//     res.end(); //end the response
//   }).listen(8080); //the server object listens on port 8080