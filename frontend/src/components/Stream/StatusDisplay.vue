<template>
    <v-layout row align-center justfy-space-around class="text-xs-center" pt-2>
        <v-flex>
            <v-icon v-if="streamOnline" style="color: green">input</v-icon>
            <v-icon v-if="!streamOnline" style="color: red">input</v-icon>
        </v-flex>
        <v-flex v-if="streamName">
            {{streamName}}
        </v-flex>
        <v-flex v-if="!streamName">
            Offline
        </v-flex>
        <v-flex >
            <v-icon>schedule</v-icon>
        </v-flex>
        <v-flex >
            {{formattedDuration}}
        </v-flex>
        <v-flex>
            <v-icon>people</v-icon>
        </v-flex>
        <v-flex>
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