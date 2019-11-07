import Vue from 'vue'
import store from './store'
import home from '@/home.vue'
import config from '../../src/config.json'

import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faArrowUp, 
  faArrowDown,
  faLightbulb,
  faTemperatureHigh,
  faDoorOpen,
  faDoorClosed
} 
from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome'

library.add(faArrowDown)
library.add(faArrowUp)
library.add(faLightbulb)
library.add(faTemperatureHigh)
library.add(faDoorClosed)
library.add(faDoorOpen)

Vue.component('icon', FontAwesomeIcon)
Vue.component('stacked-icons', FontAwesomeLayers)

import Echo from "laravel-echo"
import Pusher from "pusher-js"

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: config.pusher_key,
  cluster: 'eu',
  forceTLS: true
});

const vueConfig = {
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          config: config,
        }
      },
    })
  }
}

Vue.use(vueConfig)

const app = new Vue({
    el: '#app',
    store:store,
    created () {
      this.$store.dispatch('setDeviceConfig')
    },
    components: {
       'home':home
    }
});