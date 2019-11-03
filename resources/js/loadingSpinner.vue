<style scoped>
.lds-dual-ring {
  display: inline-block;
  width: 50px;
  height: 50x;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 65px;
  height: 65px;
  margin: 1px;
  border-radius: 50%;
  border: 5px solid #DE7E29;
  border-color: #DE7E29 transparent #DE7E29 transparent;
  animation: lds-dual-ring 2.0s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

<template>

<div>
    <div class="lds-dual-ring"></div>
</div>

</template>

<script>
export default {
 
    components: {
    },
    props: [
    ],
    data () {
        return {
        }
    },
    computed: {
    },
    methods: {
    
    },
    mounted () {
    }
}
</script>