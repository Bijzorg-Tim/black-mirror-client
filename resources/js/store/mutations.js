import config from '#/src/config.js'

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

export const startCardReadLoop = (state, payload) => {
    let pyshell = new window.PythonShell(window.dirname + '/cardReadLoop.py');
 
    pyshell.on('message', function (message) {
    // received a message sent from the Python script (a simple "print" statement)
    console.log(message);
    });
    
    // end the input stream and allow the process to exit
    pyshell.end(function (err,code,signal) {
    if (err) throw err;
    console.log('The exit code was: ' + code);
    console.log('The exit signal was: ' + signal);
    console.log('finished');
    console.log('finished');
    });
}
