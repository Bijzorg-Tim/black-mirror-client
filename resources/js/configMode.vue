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
// window.io = require('socket.io-client');
window.Pusher = require('pusher-js')

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
            broadcaster: 'pusher',
            key: 'your-pusher-key',
            wsHost: 'toegang.hetdagelijksbestaan.nl',
            wsPort: 6001,
            forceTLS: false,
            disableStats: true
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