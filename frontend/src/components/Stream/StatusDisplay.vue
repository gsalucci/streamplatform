<template>
    <v-layout row align-center justfy-space-around class="text-xs-center" pt-2>
        <v-flex>
            <v-icon v-if="streamOnline" style="color: green">input</v-icon>
            <v-icon v-if="!streamOnline" style="color: red">input</v-icon>
        </v-flex>
        <v-flex v-if="streamName && playStream">
            {{streamName}}
        </v-flex>
        <v-flex v-if="!streamName && playStream">
            Offline
        </v-flex>
        <v-flex v-if="vod">
            {{vod.split('.')[0]}}
        </v-flex>
        <v-flex v-if="!vod">
            <v-icon>schedule</v-icon>
        </v-flex>
        <v-flex v-if="!vod">
            {{formattedDuration}}
        </v-flex>
        <v-tooltip v-model="tooltip" bottom>
            <template v-slot:activator="{ on }">
                <v-flex v-if="vod"
                    v-clipboard="() => {return 'https://stream.mpk.dynu.net/vod/'+vod}"
                    v-clipboard:succes="clipboardSuccess">
                    <v-icon>mdi-content-copy</v-icon>
                </v-flex>
            </template>
        <span>Copied</span>
        </v-tooltip>
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
                tooltip: false

            }
        },
        computed: {
            ...mapGetters([
                'streamName',
                'streamOnline',
                'streamDuration',
                'streamSpectators',
                'vod',
                'playStream'
            ]),
            formattedDuration(){
                let h, m, s = 0
                let t = this.streamDuration / 1000
                s = t % 60
                m = Math.floor(t / 60) < 60 ? Math.floor(t / 60) : Math.floor(t / 60) - 60
                h = Math.floor(t/ 3600)
                return h + ' : ' + m + ' : ' + s
            }
        },
        methods: {
            clipboardSuccess() {
                //console.log('[clipboardSuccess] '+ value)
                this.tooltip = true
                setTimeout(()=>{
                    this.tooltip = false
                },1000)
            }
        }
        
    }
</script>

<style lang="scss" scoped>

</style>