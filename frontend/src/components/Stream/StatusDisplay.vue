<template>
    <v-layout row align-center justify-center class="text-xs-center">
        <v-flex xs1>
            <v-icon>input</v-icon>
        </v-flex>
        <v-flex v-if="streamName" xs2>
            {{streamName}}
        </v-flex>
        <v-flex v-if="!streamName" xs2>
            No Stream
        </v-flex>
        <v-flex xs1>
            <v-icon v-if="streamOnline" style="color: green">live_tv</v-icon>
            <v-icon v-if="!streamOnline" style="color: red">live_tv</v-icon>
        </v-flex>
        <v-flex v-if="streamOnline" xs2>
            Online
        </v-flex>
        <v-flex v-if="!streamOnline" xs2>
            Offline
        </v-flex>
        <v-flex xs1>
            <v-icon>schedule</v-icon>
        </v-flex>
        <v-flex xs2>
            {{streamDuration}}
        </v-flex>
        <v-flex xs1>
            <v-icon>people</v-icon>
        </v-flex>
        <v-flex xs2>
            {{streamSpectators}}
        </v-flex>
    </v-layout>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        data() {
            return {

            }
        },
        computed: {
            ...mapGetters([
                'streamName',
                'streamOnline',
                'streamDuration',
                'streamSpectators'
            ])
        },
        
    }
</script>

<style lang="scss" scoped>

</style>