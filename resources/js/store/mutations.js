export const setDeviceConfig = (state) => {
    state.mainconfig = JSON.parse(fs.readFileSync(window.dirname + '/mainconfig.json','utf8'))
    
    if (window.fs.existsSync(window.dirname + '/deviceconfig.json')) {
        state.deviceConfig = JSON.parse(fs.readFileSync(window.dirname + '/deviceconfig.json','utf8'))
        state.configMode = false
    }
}

export const getTempConfig = (state) => {
    state.tempConfig = JSON.parse(fs.readFileSync(window.dirname + '/tempconfig.json','utf8'))
}

export const updateSoftware = (state) => {
    child_process.exec("bash " + window.dirname + "/update.sh", function(err, stdout,stderr){
    });
}

export const deleteConfig = (state) => {
    if (fs.existsSync(window.dirname + 'deviceconfig.json')) {

        config = JSON.parse(fs.readFileSync(window.dirname + 'deviceconfig.json'))
        
        axios({
            url: 'http://' + state.mainconfig.api_url + ':' + state.mainconfig.api_port + '/device-deleting-config',
            method: 'POST',
            data: config,
        }).then(() => {})
        .catch(() => {})

        fs.unlinkSync(window.dirname + 'deviceconfig.json')
    }

    if (fs.existsSync(window.dirname + 'tempconfig.json')) {
        fs.unlinkSync(window.dirname + 'tempconfig.json') 
    }
    

    const pin = Math.floor(Math.random() * 1000000)
    const ip = os.networkInterfaces()[mainconfig.interface_name][0].address
    const tempconfig = {
        pin: pin,
        ip: ip
    }

    axios({
        url: 'http://' + state.mainconfig.api_url + ':' + state.mainconfig.api_port + '/device-needs-setup',
        method: 'POST',
        data: tempconfig,
        }).then(() => {

        }).catch(() => {

        })

    fs.writeFileSync(window.dirname + 'tempconfig.json', JSON.stringify(tempconfig))


    child_process.exec("pm2 restart")
    
}







export const documentClicked = (state) =>  {
    clearTimeout(state.screenTimeout);

    child_process.exec("sudo node " + window.dirname + "/turnon.js", function(err, stdout,stderr){});

    setTimeout(function(){ 
        state.inputDisabled = false
    }, 400);


    state.screenTimeout = setTimeout(function(){ 
        state.inputDisabled = true
        // child_process.exec("sudo node " + window.dirname + "/turnoff.js", function(err, stdout,stderr){});
        //turn screen off
    }, state.deviceConfig.room.screen_timeout_in_seconds * 1000);
}

export const turnonscreen = (state) =>  {
    child_process.exec("sudo node " + window.dirname + "/turnon.js", function(err, stdout,stderr){});
}

export const setCards = (state) => {
    if (fs.existsSync(window.dirname + '/cards.json')) {
        state.cards = JSON.parse(window.fs.readFileSync(window.dirname + '/cards.json','utf8'))
    }
}

export const startCardReadLoop = (state) => {
    let pyshell = new window.PythonShell(window.dirname + '/cardReadLoop.py', { pythonOptions: ['-u']});
    
    pyshell.on('message', function (message) {
    // received a message sent from the Python script (a simple "print" statement)
        state.cardRead = message
    });
    
    // end the input stream and allow the process to exit
    pyshell.end(function (err,code,signal) {
    if (err) throw err;
    });
}

export const addDeviceStatusToDeviceConfig = (state, payload) => {
    state.deviceConfig.devicestatus = payload
}

export const resetCard = (state, payload) => {
    state.cardRead = null
}


