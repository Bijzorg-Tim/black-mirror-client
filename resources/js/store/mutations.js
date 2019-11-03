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




