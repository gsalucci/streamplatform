<template>
<video-player class="vjs-big-play-centered" controls :playsinline="true" :options='playerOptions' ref="videoPlayer" @error="onError"/>
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
                muted: false,
                controls: true,
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
            ...mapGetters(['streamName', 'streamOnline','vod']),
            player() {
                return this.$refs.videoPlayer.player
            }
        },
        methods: {
            onError(e) {
                console.log('[videoPlayer] error: '+JSON.stringify(e))
            }
        },
        watch: {
            streamOnline() {
                if (this.streamOnline) {
                    console.log('[streamOnlineWatcher] stream is ONLINE')
                    let interval = setInterval(() => {
                        fetch('/hls/' + this.streamName + '.m3u8', {
                            method:'GET'
                        })
                        .then((res) => {
                            if (res.ok) {
                                console.log('[streamOnlineWatcher] setting player source to: /hls/'+ this.streamName + '.m3u8')
                                this.player.src({
                                    src: '/hls/' + this.streamName + '.m3u8',
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
                    //this.player.src('')
                    //this.player.reset()
                    
                }
            },
            vod(){
                if (this.vod) {
                    console.log('[vodWatcher] selected vod is: '+this.vod+' setting player source to: '-'/vod/'+this.vod)
                    this.player.src({
                        src: '/vod/' + this.vod,
                        type: 'video/mp4'
                    })
                    this.player.play()
                }
            }

        }
    }
</script>

<style>

</style>