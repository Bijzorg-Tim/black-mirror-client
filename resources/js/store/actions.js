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