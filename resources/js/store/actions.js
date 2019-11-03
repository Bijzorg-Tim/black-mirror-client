import axios from 'axios'

export const setDeviceConfig = ({commit}) => {
    commit('setDeviceConfig')
}

export const setNewConfig = ({commit}, payload) => {
    commit('setNewConfig', payload)
}

