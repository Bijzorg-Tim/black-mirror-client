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
        <div class="customButton centerContent customButton-left" >
            <span class="innerButton notification centerContent" @click="verlichtingButtonClicked()">
                <article @click="verlichtingButtonClicked()" :class="[{'tunrnedOn': verlichting}]">
                    <div class="content">
                        <loadingSpinner v-if="verlichtingDisabled" />
                        <icon v-else class="custom-icon verlichtingIcon centerText" icon="lightbulb" />
                    </div>
                </article>
            </span>
        </div>
        <div class="customButton centerContent" >
            <span class="innerButton notification centerContent" @click="deurButtonClicked()">
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
            <span class="innerButton notification centerContent" @click="verwarmingButtonClicked()">
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

            if (this.setTemperature + this.deviceConfig.verwarming_uit_na_graden_extra < this.currentTemperature) {
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
        verlichtingButtonClicked () {
            //check if button is disabled
            if (this.inputDisabled) {return}
            if (this.verlichtingDisabled) {
                return
            }
            this.setDisableWithTimeout('verlichtingDisabled')
            //toggle lighting
            if (this.verlichting) {
               return this.verlichting = false
            } 
            return this.verlichting = true
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
                return this.verwarming = false
            } 
            return this.verwarming = true
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
               return this.deur = false
            } 
            return this.deur = true
        },
        increaseTemperature () {
            if (this.inputDisabled) {return}
            if (this.setTemperature < this.deviceConfig.max_temperatuur) {
                this.setTemperature = this.setTemperature + this.deviceConfig.temperatuur_increments
            }
        },
        decreaseTemperature () {
            if (this.inputDisabled) {return}
            if (this.setTemperature > this.deviceConfig.min_temperatuur) {
                this.setTemperature = this.setTemperature - this.deviceConfig.temperatuur_increments
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
            window.tempsensor.read(22, this.deviceConfig.tempsensor_pin, function(err, temperature, humidity) {
                if (!err) {
                    this.currentTemperature = Math.round(temperature * 10) / 10
                }
            }.bind(this));
        },
        tempReadLoop () {
            setInterval(function() { 
                this.readTemperature()
            }.bind(this), this.deviceConfig.temp_read_interval_in_seconds * 1000);
        },
        setUpPins(){
            this.verlichtingPin = new Gpio(this.deviceConfig.light_pin, 'out')
            this.verlichtingPin.writeSync(0)
            this.verwarmingPin = new Gpio(this.deviceConfig.heating_pin, 'out')
            this.verwarmingPin.writeSync(0)
            this.deurPin = new Gpio(this.deviceConfig.door_pin, 'out')
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
        }
    },
    watch: {
        verwarmingStatus () {
            if (this.verwarmingStatus) {
                return this.verwarmingPin.writeSync(1)
            }
                this.verwarmingPin.writeSync(0)
        },
        verlichting () {
            if (this.verlichting) {
                return this.verlichtingPin.writeSync(1)
            }
            this.verlichtingPin.writeSync(0)
        },
        deur () {
            if (this.deur) {
                return this.deurPin.writeSync(1)
            }
            this.deurPin.writeSync(0)
        },
        cardRead () {
            if (this.cardRead === null) {return}

            const card = this.cards.find(a => a.cardId === this.cardRead)

            if (card !== undefined) {
                this.ExternalDoorToggle()
            }
        }
    },
    created () {
        this.setTemperature = this.deviceConfig.standaard_temperatuur
        this.setUpPins()
        this.readTemperature()
        this.tempReadLoop()
        // this.$store.dispatch('setCards')
        // this.$store.dispatch('startCardReadLoop')
    },
    mounted () {
        // window.Echo.channel(this.config.LIGHT_CHANNEL)
        // .listen('.toggle', (message) => {
        //     if (this.verlichting) {
        //        return this.verlichting = false
        //     } 
        //     return this.verlichting = true
        // });
        // this.setUpChannels()
    }
}
</script>