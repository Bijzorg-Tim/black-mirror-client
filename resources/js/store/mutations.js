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

export const documentClicked = (state) =>  {
    clearTimeout(state.screenTimeout);

    window.child_process.exec("sudo node" + window.dirname + "/turnon.js", function(err, stdout,stderr){});

    setTimeout(function(){ 
        state.inputDisabled = false
    }, 250);


    state.screenTimeout = setTimeout(function(){ 
        state.inputDisabled = true
        window.child_process.exec("sudo node" + window.dirname + "/turnoff.js", function(err, stdout,stderr){});
        //turn screen off
    }, state.deviceConfig.room.screen_timeout_in_seconds * 1000);
}

export const setCards = (state) => {
    state.cards = JSON.parse(window.fs.readFileSync(window.dirname + '/cards.json','utf8'))
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

