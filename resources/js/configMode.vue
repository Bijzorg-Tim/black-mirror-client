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
<div class="centerContent">
<h2 class="subtitle">IP: {{tempConfig.ip}}</h2>
</div>

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
            gebouw: null,
            verdieping: null,
            kamer: null
        }
    },
    computed: {
        tempConfig () {return this.$store.getters['tempConfig']}
    },
    methods: {
    },
    mounted () {
        this.$store.dispatch('getTempConfig')
    }
}
</script>