export const setDeviceConfig = (state) => {
    state.mainconfig = JSON.parse(fs.readFileSync(window.dirname + '/mainconfig.json','utf8'))
    
    if (window.fs.existsSync(window.dirname + '/deviceconfig.json')) {
        state.deviceConfig = JSON.parse(fs.readFileSync(window.dirname + '/deviceconfig.json','utf8'))
        state.configMode = false
    }
}

export const setNewDeviceConfig = (state, payload) => {
    fs.writeFileSync(window.dirname + '/deviceconfig.json', JSON.stringify(payload))
    state.deviceConfig = JSON.parse(fs.readFileSync(window.dirname + '/deviceconfig.json','utf8'))
    state.configMode = false
    if (fs.existsSync(window.dirname + '/tempconfig.json')) {
        fs.unlinkSync(window.dirname + '/tempconfig.json') 
    }
}

export const resetApplication = (state) => {
    child_process.exec("pm2 restart all", function(err, stdout,stderr){});
}

export const shutdownDevice = (state) => {
    child_process.exec("sudo shutdown now", function(err, stdout,stderr){});
}

export const rebootDevice = (state) => {
    child_process.exec("sudo reboot now", function(err, stdout,stderr){});
}

export const getTempConfig = (state) => {
    state.tempConfig = JSON.parse(fs.readFileSync(window.dirname + '/tempconfig.json','utf8'))
}

export const updateSoftware = (state) => {
    child_process.exec("bash " + window.dirname + "/update.sh", function(err, stdout,stderr){
    });
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


