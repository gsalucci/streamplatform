<template>    
    <v-layout column justify-center>
        <VideoPlayer/>
        <v-divider class="mt-2"/>
        <StatusDisplay/>
    </v-layout>
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