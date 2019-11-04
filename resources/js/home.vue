<template>

<div>
   <topBar />
   <span v-if="!configMode">
   <secondBar />
   <div class="container">
    <buttons />
   </div>
   </span>


   <span v-if="configMode">
     <div class="container">
       <br>
      <configMode />
     </div>
   </span>
</div>

</template>

<script>

import topBar from '@/topBar.vue'
import secondBar from '@/secondBar.vue'
import buttons from '@/buttons.vue'
import configMode from '@/configMode.vue'
import config from '#/src/config.js'

export default {
    components: {
      topBar,
      buttons,
      secondBar,
      configMode
    },
    props: [
    ],
    data () {
        return {
          cards: []
        }
    },
    computed: {
      configMode () {
        return this.$store.getters['configMode']
      }
    },
    methods: {
      documentClicked (e) {
        e.stopPropagation()
        this.$store.dispatch('documentClicked')
      }
    },
    mounted () {
      document.addEventListener('click', this.documentClicked)
      document.addEventListener('touchstart', this.documentClicked)
      this.$store.dispatch('documentClicked')
      window.backlight.setBrightness(this.config.SCREEN_BRIGHTNESS);
    }
}
</script>




