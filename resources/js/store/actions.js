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

export const buttonUpdate = ({commit, state}) => {
    console.log(state.deviceConfig)
    // return axios({
    //     url: 'http://' + mainconfig.api_url + ':' + mainconfig.api_port + '/device-deleting-config',
    //     method: 'POST',
    //     data: config,
    // }).then(() => {})
    // .catch(() => {})
}

export const pong = ({commit, state}, payload) => {

    const data = {
        devicestatus: payload,
        device: state.deviceConfig

    }
    return axios({
        url: 'http://' + state.mainconfig.api_url + ':' + state.mainconfig.api_port + '/pong',
        method: 'POST',
        data: data,
    }).then(() => {})
    .catch(() => {})
}