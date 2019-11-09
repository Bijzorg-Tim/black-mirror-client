<template>

<div>
   <topBar />
   <span v-if="!configMode">
   <secondBar />
   <div class="container">
    <buttons />
   </div>
   </span>

  <!-- <button @click="close"><i class="fa fa-cube" aria-hidden="true"></i>&nbsp; Close application</button> -->

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
        }
    },
    computed: {
      configMode () {
        return this.$store.getters['configMode']
      },
      deviceConfig () {return this.$store.getters['deviceConfig']}
    },
    methods: {
      documentClicked (e) {
        e.stopPropagation()
        this.$store.dispatch('documentClicked')
      },
       close() {
                app.relaunch()
                app.quit()
            }
    },
    mounted () {
      document.addEventListener('click', this.documentClicked)
      document.addEventListener('touchstart', this.documentClicked)
      this.$store.dispatch('documentClicked')
      window.backlight.setBrightness(this.deviceConfig.screen_brightness);
    }
}
</script>
