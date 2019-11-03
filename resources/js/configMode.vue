<style>

</style>



<template>

<div>

    <form @submit.prevent="configuratieOpslaan()">

    <div class="field is-horizontal">
        <div class="field-label is-normal">
            <label class="label">Gebouw</label>
        </div>
        <div class="field-body">
            <div class="field">
            <div class="control">
                <div class="select is-fullwidth">
                <select v-model="gebouw">
                    <option value="Kas">Kas</option>
                    <option value="Ontharding">Ontharding</option>
                </select>
                </div>
            </div>
            </div>
        </div>
    </div>

    <div class="field is-horizontal" v-if="gebouw">
        <div class="field-label is-normal">
            <label class="label">Verdieping</label>
        </div>
        <div class="field-body">
            <div class="field">
            <div class="control">
                <div class="select is-fullwidth">
                <select v-model="verdieping">
                    <option value=0>0</option>
                    <option value=1>1</option>
                    <option value=-1>-1</option>
                </select>
                </div>
            </div>
            </div>
        </div>
    </div>

    <div class="field is-horizontal" v-if="verdieping">
        <div class="field-label is-normal">
            <label class="label">Kamer</label>
        </div>
        <div class="field-body">
            <div class="field">
            <div class="control">
                <div class="select is-fullwidth">
                <select v-model="kamer">
                    <option :value="{id:4, naam:'Tim'}">Slaapkamer Tim en Amel</option>
                </select>
                </div>
            </div>
            </div>
        </div>
    </div>

    <div class="field is-horizontal" v-if="kamer">
        <div class="field-label">
            <!-- Left empty for spacing -->
        </div>
        <div class="field-body">
            <div class="field">
            <div class="control">
                <button class="button is-primary">
                Opslaan
                </button>
            </div>
            </div>
        </div>
    </div>

    </form>





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
    },
    methods: {
        configuratieOpslaan () {
            console.log(this.gebouw)
            console.log(this.verdieping)
            console.log(this.kamer)
            this.$store.dispatch('setNewConfig', this.kamer)
        }
    },
    mounted () {
    }
}
</script>