<style>

</style>



<template>

<div>

<div class="centerContent">
<h1 class="title">Config Mode</h1>
</div>
<div class="centerContent">
<h2 class="subtitle">Pin: {{tempConfig.pin}}</h2>
</div>

</div>

</template>

<script>

import Echo from 'laravel-echo'
window.io = require('socket.io-client');

export default {
    components: {
    },
    props: [
    ],
    data () {
        return {
            gebouw: null,
            verdieping: null,
            kamer: null
        }
    },
    computed: {
        tempConfig () {return this.$store.getters['tempConfig']},
        mainconfig(){
            return this.$store.getters['mainconfig']
        },
    },
    methods: {
    },
    mounted () {
        this.$store.dispatch('setTempConfig').then(() => {
            this.$store.dispatch('getTempConfig')
        })
        this.echo = new Echo({
            broadcaster: 'socket.io',
            host: 'http://' + this.mainconfig.api_url + ':6001',
            authEndpoint: '/custom/broadcast/auth/route'
        })

        this.echo.channel('deviceconfigchannel')
        .listen('.setConfig', (message) => {
            if (this.tempConfig.pin == message.channelrequest.pin) {
                this.$store.dispatch('setNewDeviceConfig', message.channelrequest).then(() => {
                })
            }
        })
    }
}
</script>