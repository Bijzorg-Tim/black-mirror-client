<style>

.mainbutton {
    height: 200px !important;
    width: 200px !important;
}

.centerContent {
    display: flex;
    justify-content: center;
    align-items: center;
}

.centerText {
   text-align: center;
    vertical-align: middle;
}

.tunrnedOn {
     /* background-color: green;
     color: #fff;  */
}

.tunrnedOn .verwarmingIcon {
    color: orange;
}

.tunrnedOn .verlichtingIcon {
    color: yellow;
}

.temperatureSet {
    font-size:50px;
}

.custom-icon {
    font-size:50px;
}

.deurIconOpen {
    color: green
}

.deurIconClosed {
    color: red
}


.customButton {
  float: left;
  width: 33.33%;
  padding: 5px;
  height: 175px;
  margin-bottom: 5px;
  margin-top: 0px !important;
}

.customButton-left {
  padding-left: 10px !important;
}

.customButton-right {
  padding-right: 10px !important;
}

.innerButton {
    position: relative;
    height: 100%;
    width: 100%;
    padding-left: 24px;
    padding-right: 24px;
}

article {
    padding-right:24px;
    padding-left:24px;
}
/* Clear floats after the columns */

</style>


<template>

<div>
    <div class="row">
        <div class="customButton centerContent customButton-left">
            <span class="innerButton notification centerContent" @click="verlichtingButtonClicked()" v-if="deviceConfig.room.verlichting">
                <article @click="verlichtingButtonClicked()" :class="[{'tunrnedOn': verlichting}]">
                    <div class="content">
                        <loadingSpinner v-if="verlichtingDisabled" />
                        <icon v-else class="custom-icon verlichtingIcon centerText" icon="lightbulb" />
                    </div>
                </article>
            </span>
        </div>
        <div class="customButton centerContent" >
            <span class="innerButton notification centerContent" @click="deurButtonClicked()" v-if="deviceConfig.room.deur">
                <article @click="deurButtonClicked()" :class="[{'tunrnedOn': deur}]">
                <div class="content centerText">
                    <loadingSpinner v-if="deurDisabled" />
                    <span v-else>
                        <icon v-if="deur" class="custom-icon deurIconOpen" icon="door-open" />
                        <icon v-else class="custom-icon deurIconClosed" icon="door-closed" />
                    </span>
                </div>
            </article>
            </span>
        </div>
        <div class="customButton centerContent customButton-right" >
            <span class="innerButton notification centerContent" @click="verwarmingButtonClicked()" v-if="deviceConfig.room.verwarming">
                <article @click="verwarmingButtonClicked()" :class="[{'tunrnedOn': verwarmingKnopStatus}]">
                    <div class="content centerText">
                        <loadingSpinner v-if="verwarmingDisabled" />
                        <span v-else class="nowrap">
                            <div class="temperatureSet">{{currentTemperature}}
                                <icon class="custom-icon verwarmingIcon" icon="temperature-high" />
                            </div>
                        </span>
                    </div>
                </article>
            </span>
        </div>
    </div>

    <div class="row" v-if="verwarming">
        <div class="customButton centerContent customButton-left" >
            <span class="innerButton notification centerContent" @click="decreaseTemperature()">
                <article :class="['centerContent', {'disabledButton':verlichtingDisabled}]">
                    <div class="content">
                    <icon class="custom-icon" icon="arrow-down" />
                    </div>
                </article>
            </span>
        </div>
        <div class="customButton centerContent" >
            <span class="innerButton notification centerContent">
                <article class="centerContent">
                    <div class="centerContent">
                        <span class="temperatureSet centerText">{{setTemperature}}&deg;</span>
                    </div>
                </article>
            </span>
        </div>
        <div class="customButton centerContent customButton-right" >
            <span class="innerButton notification centerContent" @click="increaseTemperature()">
                <article class="centerContent">
                    <div class="content">
                    <icon class="custom-icon" icon="arrow-up" />
                    </div>
                </article>
            </span>
        </div>
    </div>
</div>

</template>

<script>

import loadingSpinner from '@/loadingSpinner.vue'
import Echo from 'laravel-echo'
window.io = require('socket.io-client');


export default {
    components: {
        loadingSpinner
    },
    props: [
    ],
    data () {
        return {
            verlichting: false,
            verlichtingDisabled: false,
            verlichtingTimeout: null,
            verlichtingPin: null,
            verwarming: false,
            verwarmingDisabled: false,
            verwarmingTimeout: null,
            verwarmingPin: null,
            deur: false,
            deurDisabled: false,
            deurTimeout: null,
            deurPin: null,
            currentTemperature: 14,
            setTemperature: 0,
            echo: null,
            sendNextCardToWeb: false,
            sendNextCardToWebTimeout: null
        }
    },
    computed: {
        deviceConfig(){
            return this.$store.getters['deviceConfig']
        },
        inputDisabled(){
            return this.$store.getters['inputDisabled']
        },
        verwarmingStatus () {
            if (!this.verwarming) {
                return false
            } 

            if (this.setTemperature + this.deviceConfig.room.verwarming_uit_na_graden_extra < this.currentTemperature) {
                return false
            }
            return true
        },
        verwarmingKnopStatus () {
            if (!this.verwarming) {
                return false
            } 

            if (this.setTemperature <= this.currentTemperature) {
                return false
            }
            return true
        },
        cardRead () {
            return this.$store.getters['cardRead']
        },
        cards () {
            return this.$store.getters['cards']
        }
    },
    methods: {
        sendButtonChangeToServer (action) {
            const payload = {}
            payload.action = action
            payload.device = this.deviceConfig
            payload.status = this.createStatusPayload()
            this.$store.dispatch('sendButtonChangeToServer', payload)
        },
        createStatusPayload () {
            var status = {}
            status.verlichting = this.verlichting
            status.verwarming = this.verwarming
            status.deur = this.deur
            status.currentTemperature = this.currentTemperature
            status.setTemperature = this.setTemperature

            return status
        },
        verlichtingButtonClicked () {
            //check if button is disabled
            if (this.inputDisabled) {return}
            if (this.verlichtingDisabled) {
                return
            }
            this.setDisableWithTimeout('verlichtingDisabled')
            //toggle lighting
            if (this.verlichting) {
                this.verlichting = false
                return this.sendButtonChangeToServer('verlichting')
            } 
            this.verlichting = true
            return this.sendButtonChangeToServer('verlichting')
        },
        verwarmingButtonClicked () {
            //check if button is disabled
            if (this.inputDisabled) {return}
            if (this.verwarmingDisabled) {
                return
            }
           this.setDisableWithTimeout('verwarmingDisabled')
           
            //toggle heating
            if (this.verwarming) {
                this.verwarming = false
                return this.sendButtonChangeToServer('verwarming')
            } 
            this.verwarming = true
            return this.sendButtonChangeToServer('verwarming')
        },
        deurButtonClicked () {
            //check if button is disabled
            if (this.inputDisabled) {return}
            if (this.deurDisabled) {
                return
            }
           this.setDisableWithTimeout('deurDisabled')
           
            //toggle door
            if (this.deur) {
               this.deur = false
               return this.sendButtonChangeToServer('deur')
            } 
            this.deur = true
            return this.sendButtonChangeToServer('deur')
        },
        increaseTemperature () {
            if (this.inputDisabled) {return}
            if (this.setTemperature < this.deviceConfig.room.max_temperatuur) {
                this.setTemperature = this.setTemperature + parseFloat(this.deviceConfig.room.temperatuur_increments)
            }
        },
        decreaseTemperature () {
            if (this.inputDisabled) {return}
            if (this.setTemperature > this.deviceConfig.room.min_temperatuur) {
                this.setTemperature = this.setTemperature - parseFloat(this.deviceConfig.room.temperatuur_increments)
            }
        },
        setDisableWithTimeout (type) {
             //set button to disabled
            this[type] = true
            //set disabled cancel timer
            this.verwarmingTimeout = 
                setTimeout(function() { 
                    this[type] = false
                }.bind(this), 2500);
        },
        readTemperature () {
            window.tempsensor.read(22, this.deviceConfig.room.tempsensor_pin, function(err, temperature, humidity) {
                if (!err) {
                    this.currentTemperature = Math.round(temperature * 10) / 10
                }
            }.bind(this));
        },
        tempReadLoop () {
            setInterval(function() { 
                this.readTemperature()
            }.bind(this), this.deviceConfig.room.temp_read_interval_in_seconds * 1000);
        },
        setUpPins(){
            this.deurPin = new Gpio(this.deviceConfig.room.door_pin, 'out')
            this.deurPin.writeSync(0)
        },
        ExternalDoorToggle () {
            //check if button is disabled
            if (this.deur) {
                this.verlichting = false
                this.verwarming = false
                return this.deur = false
            } 
            return this.deur = true
        },
        turnOffHeating() {
            const payload = {
                action: 'verwarming',
                value: false
            }
            return this.$store.dispatch('buttonaction', payload)
        },
        turnOffLightning() {
            const payload = {
                    action: 'verlichting',
                    value: false
                }
            return this.$store.dispatch('buttonaction', payload)
        },
        turnOnScreen() {
            return this.$store.dispatch('turnonscreen')
        },
        startCardReadLoop() {
            this.$store.dispatch('startCardReadLoop')
        }
    },
    watch: {
        verwarmingStatus () {
            if (this.verwarmingStatus) {
                const payload = {
                    action: 'verwarming',
                    value: true
                }
                return this.$store.dispatch('buttonaction', payload)
            }
            const payload = {
                action: 'verwarming',
                value: false
            }
            return this.$store.dispatch('buttonaction', payload)
        },
        verlichting () {
            if (this.verlichting) {
                const payload = {
                    action: 'verlichting',
                    value: true
                }
                return this.$store.dispatch('buttonaction', payload)
            }
            const payload = {
                    action: 'verlichting',
                    value: false
                }
            return this.$store.dispatch('buttonaction', payload)
        },
        deur () {
            if (this.deur) {
    
                return this.deurPin.writeSync(1)
            }
            this.deurPin.writeSync(0)
        },
        cardRead () {
            if (this.cardRead === null) {return}
            this.$store.dispatch('documentClicked')

            if (this.sendNextCardToWeb) {
                this.$store.dispatch('sendCardToWeb', this.cardRead)
                this.$store.dispatch('resetCard', this.cardRead)
                this.sendNextCardToWeb = false
            }

            const card = this.cards.find(a => a.sleutel === this.cardRead)

            if (card !== undefined) {
                this.ExternalDoorToggle()
            }
            this.$store.dispatch('resetCard')
            
        }
    },
    created () {
        this.setTemperature = parseInt(this.deviceConfig.room.standaard_temperatuur)
        this.setUpPins()
        this.readTemperature()
        this.tempReadLoop()
        this.startCardReadLoop()
    },
    mounted () {
        this.$store.dispatch('setCards')
        this.turnOffLightning()
        this.turnOffHeating()
        this.turnOnScreen()
        this.$store.dispatch('setCardsFromServer')

        this.echo = new Echo({
            broadcaster: 'socket.io',
            host: 'http://192.168.0.30:6001',
            authEndpoint: '/custom/broadcast/auth/route'
        })

        this.echo.channel('devicechannel')
        .listen('.updateDevice', (message) => {
            if (this.deviceConfig.id === message.device.id || message.device === 'all') {
                this[message.channelrequest.action] = message.channelrequest.status
            }
        })

        .listen('.ping', (message) => {
            var payload = this.createStatusPayload()
            this.$store.dispatch('pong', payload)
        })

        .listen('.updateSoftware', (message) => {
            if (this.deviceConfig.id === message.device.id || message.device === 'all') {
                this.$store.dispatch('updateSoftware')
            }
        })

        .listen('.restartapp', (message) => {
            if (this.deviceConfig.id === message.device.id || message.device === 'all') {
                this.$store.dispatch('resetApplication')
            }
        })

        .listen('.reboot', (message) => {
            if (this.deviceConfig.id === message.device.id || message.device === 'all') {
                this.$store.dispatch('rebootDevice')
            }
        })

        .listen('.shutdown', (message) => {
            if (this.deviceConfig.id === message.device.id || message.device === 'all') {
                this.$store.dispatch('shutdownDevice')
            }
        })

        .listen('.deleteConfig', (message) => {
            if (this.deviceConfig.id === message.device || message.device === 'all') {
                this.$store.dispatch('deleteConfig')
            }
        })

        .listen('.updateCards', (message) => {
            if (this.deviceConfig.id === message.device || message.device === 'all') {
                this.$store.dispatch('setCardsFromServer')
            }
        })

        .listen('.sendCardID', (message) => {
            console.log('received card read request')
            if (this.deviceConfig.id === message.device.id) {
                console.log('setting request')
                this.sendNextCardToWeb = true
                clearTimeout(this.sendNextCardToWebTimeout);

                this.sendNextCardToWebTimeout = setTimeout(function() { 
                    this.sendNextCardToWeb = false
                }.bind(this), 300 * 1000);
            }
        })
        
    }
}
</script>