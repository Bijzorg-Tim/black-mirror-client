export const setDeviceConfig = (state) => {
    state.deviceConfig = JSON.parse(window.fs.readFileSync(window.dirname + '/deviceConfig.json','utf8'))
    if (state.deviceConfig.id === undefined) {
        state.configMode = true
    }
}

export const setNewConfig = (state, payload) => {
    window.fs.writeFileSync(window.dirname + '/deviceConfigTEMP.json', JSON.stringify(payload));
    state.configMode = false
}

export const documentClicked = (state) =>  {
    clearTimeout(state.screenTimeout);
    window.backlight.powerOn();

    setTimeout(function(){ 
        state.inputDisabled = false
    }, 250);


    state.screenTimeout = setTimeout(function(){ 
        state.inputDisabled = true
        window.backlight.powerOff();
        //turn screen off
    }, config.SCREEN_TIMEOUT_IN_SECONDS * 1000);
}

export const setCards = (state) => {
    state.cards = JSON.parse(window.fs.readFileSync(window.dirname + '/cards.json','utf8'))
}

export const startCardReadLoop = (state) => {
    setTimeout(function(){
        state.cardRead = 1234
    }, 4000)

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
