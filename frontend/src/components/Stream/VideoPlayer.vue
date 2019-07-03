<template>
<video-player class="vjs-big-play-centered" controls :playsinline="true" :options='playerOptions' ref="videoPlayer" @ready="ready" @ended="ended"/>
    <!-- video-js vjs-default-skin  -->
</template>

<script>
    import 'video.js/dist/video-js.css'
    import { videoPlayer } from 'vue-video-player'
    import {mapGetters} from 'vuex'
    import 'videojs-contrib-hls'
    export default {
        data: () => ({
            playerOptions: {
                preload:'auto',
                responsive: true,
                muted: true,
                autoplay: false,
                fluid: true,
                techOrder: ['html5'],
                html5: { hls: { withCredentials: false } },
                handleManifestRedirects: true,
                enableLowInitialPlaylist: false
            }
        }),
        components: {
            videoPlayer
        },
        computed: {
            ...mapGetters(['streamName', 'streamOnline']),
            player() {
                return this.$refs.videoPlayer.player
            }
        },
        methods: {
            ready(){
                console.log('[ready] readyState changed!')
            },
            ended(){
                console.log('[ended] player finished playback')
                this.player.src("")
                this.player.pause()
            }
        },
        watch: {
            streamOnline() {
                if (this.streamOnline) {
                    console.log('[streamOnlineWatcher] stream is ONLINE')
                    let interval = setInterval(() => {
                        fetch(process.env.VUE_APP_STREAM_BASE + this.streamName + '.m3u8', {
                            method:'GET'
                        })
                        .then((res) => {
                            if (res.ok) {
                                console.log('[streamOnlineWatcher] setting player source to: '+process.env.VUE_APP_STREAM_BASE + this.streamName + '.m3u8')
                                this.player.src({
                                    src: process.env.VUE_APP_STREAM_BASE + this.streamName + '.m3u8',
                                    type: 'application/x-mpegURL'
                                })
                                this.player.play()
                                clearInterval(interval)
                            }
                        })
                        .catch(e => {
                            console.log("Awaiting playlist..." + JSON.stringify(e))
                        })
                    },100)

                } else {
                    console.log('[streamOnlineWatcher] stream is OFFLINE')
                    this.player.src('')
                    //this.player.reset()
                    
                }
            }
        }
    }
</script>

<style>

</style>