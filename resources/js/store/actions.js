import axios from 'axios'

export const setNewDeviceConfig = ({commit}, payload) => {
    commit('setNewDeviceConfig', payload)
}

export const setDeviceConfig = ({commit}, payload) => {
    commit('setDeviceConfig', payload)
}

export const rebootDevice = ({commit}, payload) => {
    commit('rebootDevice', payload)
}

export const shutdownDevice = ({commit}, payload) => {
    commit('shutdownDevice', payload)
}

export const resetApplication = ({commit}, payload) => {
    commit('resetApplication', payload)
}

export const getTempConfig = ({state, commit}) => {
    commit('getTempConfig')
    axios({
        url: 'http://' + state.mainconfig.api_url + ':' + state.mainconfig.api_port + '/device-needs-setup',
        method: 'POST',
        data: state.tempConfig,
        }).then(() => {

        }).catch(() => {

        })

}

export const documentClicked = ({commit}) => {
    commit('documentClicked')
}

export const setCards = ({commit}) => {
    commit('setCards')
}

export const setCardsFromServer = ({commit, state}) => {
    axios({
        url: 'http://' + state.mainconfig.api_url + ':' + state.mainconfig.api_port + '/get-cards-for-device/' + state.deviceConfig.id,
        method: 'POST',
    }).then((response) => {
        fs.writeFileSync(window.dirname + '/cards.json', JSON.stringify(response.data), 'utf-8')
        commit('setCards')
    })
    .catch(() => {})
}

export const startCardReadLoop = ({commit, state}) => {
    commit('startCardReadLoop')
}

export const startDoorSensorLoop = ({commit, state}) => {
    commit('startDoorSensorLoop')
}

export const turnonscreen = ({commit, state}) => {
    commit('turnonscreen')
}

export const setBrightness = ({commit, state}) => {
    commit('setBrightness')
}

export const resetCard = ({commit, state}) => {
    commit('resetCard')
}

export const updateSoftware = ({commit, state}) => {
    commit('updateSoftware')
}

export const deleteConfig = ({commit, state}) => {
    if (fs.existsSync(window.dirname + '/deviceconfig.json')) {
        const config = JSON.parse(fs.readFileSync(window.dirname + '/deviceconfig.json'))
        
        axios({
            url: 'http://' + state.mainconfig.api_url + ':' + state.mainconfig.api_port + '/device-deleting-config',
            method: 'POST',
            data: config,
        }).then(() => {})
        .catch(() => {})

        fs.unlinkSync(window.dirname + '/deviceconfig.json')
    }

    if (fs.existsSync(window.dirname + '/tempconfig.json')) {
        fs.unlinkSync(window.dirname + '/tempconfig.json') 
    }

    const pin = Math.floor(Math.random() * 1000000)
    const tempconfig = {
        pin: pin,
    }
    
    fs.writeFileSync(window.dirname + '/tempconfig.json', JSON.stringify(tempconfig))
    commit('resetApplication')


}

export const setTempConfig = ({commit, state}) => {
    if (!fs.existsSync(window.dirname + '/tempconfig.json')) {
      
        
        const pin = Math.floor(Math.random() * 1000000)
        const tempconfig = {
            pin: pin,
        }
        
        fs.writeFileSync(window.dirname + '/tempconfig.json', JSON.stringify(tempconfig))
    }
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

    console.log('sending key to server')
    return axios({
        url: 'http://' + state.mainconfig.api_url + ':' + state.mainconfig.api_port + '/send-card-from-device-to-web/',
        method: 'POST',
        data: data,
    }).then(() => {})
    .catch(() => {})
}











