<style scoped>

.level {
    background-color: #DE7E29;
    padding-top: 10px;
    padding-bottom: 10px;
}

.level .title {
    color: #fff;
}

</style>

<template>

<div>
    <nav class="level is-mobile">
  <div class="level-item has-text-centered">
    <div>
      <p class="title">{{currentDate}}</p>
    </div>
  </div>
  <div class="level-item has-text-centered">
    <div>
      <p class="title">{{currentTime}}</p>
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