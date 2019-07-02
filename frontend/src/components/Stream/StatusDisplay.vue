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
            {{formattedDuration}}
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
            ]),
            formattedDuration(){
                let h, m, s = 0
                let t = this.streamDuration / 1000
                s = t % 60
                m = Math.floor(t / 60)
                h = Math.floor(t/ 3600)
                return h +' : '+m+' : '+s
            }
        },
        
    }
</script>

<style lang="scss" scoped>

</style>