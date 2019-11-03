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
    },
    mounted () {
        // else {
        //   fs.writeFile(window.dirname + '/cards.js', JSON.stringify(this.cards), 'utf8', function(err) {
        //     console.log(err)
        //   });
        // }

    }
}
</script>