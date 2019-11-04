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
    state.inputDisabled = false
    window.backlight.powerOn();
    state.screenTimeout = setTimeout(function(){ 
        state.inputDisabled = true
        window.backlight.powerOff();
        //turn screen off
    }, config.SCREEN_TIMEOUT_IN_SECONDS * 1000);
}




