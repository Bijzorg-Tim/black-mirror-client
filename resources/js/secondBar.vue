<style scoped>
.centerContent {
    padding-top: 10px;
    padding-bottom: 10px;
}
</style>

<template>

<div>
    <nav class="level is-mobile">
        <div class="level-item has-text-centered">
            <div class="centerContent">
            <p class="title">{{deviceConfig.room.naam}}</p>
            </div>
        </div>
    </nav>
</div>

</template>

<script>

import 'moment/locale/nl'
import moment from 'moment'


export default {
    
 
    components: {
    },
    props: [
    ],
    data () {
        return {
            moment: moment,
            currentTime: null,
            currentDate: null
        }
    },
    computed: {
        deviceConfig() {
            return this.$store.getters['deviceConfig']
        },
        card() {
            return this.$store.getters['cardRead']
        }
    },
    methods: {
        setCurrentTime() {
            setInterval(function() { 
                this.currentTime = moment().format('HH:mm:ss')
                this.currentDate = moment().format('dddd DD MMMM YYYY')
            }.bind(this), 1000);
        }
    },
    created () {
        this.currentTime = moment().format('HH:mm:ss')
        this.currentDate = moment().format('dddd DD MMMM YYYY')
    },
    mounted () {
        this.setCurrentTime()
    }
}
</script>