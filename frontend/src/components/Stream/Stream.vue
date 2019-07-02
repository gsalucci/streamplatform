<template>
    <v-card>
        <v-card-text>
            <v-flex xs12>
                <VideoPlayer/>
            </v-flex>
        </v-card-text>
        <v-divider/>
        <v-card-actions class="pa-3" justify-center>
            <StatusDisplay/>
        </v-card-actions>
    </v-card>

</template>

<script>
    import VideoPlayer from './VideoPlayer'
    import StatusDisplay from './StatusDisplay'
    export default {
        data() {
            return {}
        },
        components: {
            VideoPlayer,
            StatusDisplay
        }
        
    }
</script>

<style>

</style>