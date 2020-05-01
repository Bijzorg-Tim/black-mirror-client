import axios from 'axios'


export const setDeviceConfig = ({commit}) => {
    commit('setDeviceConfig')
}

export const getTempConfig = ({commit}) => {
    commit('getTempConfig')
}

export const documentClicked = ({commit}) => {
    commit('documentClicked')
}

export const setCards = ({commit, state}) => {
    commit('setCards')
}

export const startCardReadLoop = ({commit, state}) => {
    commit('startCardReadLoop')
}

export const turnonscreen = ({commit, state}) => {
    commit('turnonscreen')
}

export const resetCard = ({commit, state}) => {
    commit('resetCard')
}

export const updateSoftware = ({commit, state}) => {
    commit('updateSoftware')
}

export const deleteConfig = ({commit, state}) => {
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
    const tempconfig = {
        pin: pin,
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



export const pong = ({commit, state}, payload) => {
    commit('addDeviceStatusToDeviceConfig', payload)

    return axios({
        url: 'http://' + state.mainconfig.api_url + ':' + state.mainconfig.api_port + '/pong',
        method: 'POST',
        data: state.deviceConfig,
    }).then(() => {})
    .catch(() => {})
}

export const sendButtonChangeToServer = ({commit, state}, payload) => {
    return axios({
        url: 'http://' + state.mainconfig.api_url + ':' + state.mainconfig.api_port + '/button-change-from-device',
        method: 'POST',
        data: payload,
    }).then(() => {})
    .catch(() => {})
}

export const sendIp = ({state}, payload) => {
    const data = state.mainconfig
    return axios({
        url: 'http://' + state.mainconfig.api_url + ':' + state.mainconfig.api_port + '/sendIpFromDevice/' + payload.id,
        method: 'POST',
        data: data,
    }).then(() => {})
    .catch(() => {})
}

export const buttonaction = ({state}, payload) => {
    const devicefunction = state.deviceConfig.functions.find(a => a.function === payload.action)
    const data = {
        pin: devicefunction.pin,
        action: payload.value
    }
    return axios({
        url: 'http://' + devicefunction.ip + '/action',
        method: 'POST',
        data: data,
    }).then(() => {})
    .catch(() => {})
}

export const sendCardToWeb = ({state}, payload) => {
    const data = {
        sleutel: payload
    }
    return axios({
        url: 'http://' + state.mainconfig.api_url + ':' + state.mainconfig.api_port + '/send-card-from-device-to-web/',
        method: 'POST',
        data: data,
    }).then(() => {})
    .catch(() => {})
}











