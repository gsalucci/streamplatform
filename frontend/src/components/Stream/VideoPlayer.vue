<template>
<video-player class="vjs-big-play-centered" controls :playsinline="true" :options='playerOptions' ref="videoPlayer"/>
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
                html5: { 
                    hls: { withCredentials: false }, 
                    mp4: { withCredentials: false }
                    },
                handleManifestRedirects: true,
                enableLowInitialPlaylist: false
            }
        }),
        components: {
            videoPlayer
        },
        computed: {
            ...mapGetters(['streamName', 'streamOnline','vod','playStream']),
            player() {
                return this.$refs.videoPlayer.player
            }
        },
        methods: {
        },
        watch: {
            streamOnline() {
                if (this.streamOnline) {
                    //console.log('[streamOnlineWatcher] stream is ONLINE')
                    let interval = setInterval(() => {
                        fetch('/hls/' + this.streamName + '.m3u8', {
                            method:'GET'
                        })
                        .then((res) => {
                            if (res.ok) {
                                //console.log('[streamOnlineWatcher] setting player source to: /hls/'+ this.streamName + '.m3u8')
                                this.player.src({
                                    src: '/hls/' + this.streamName + '.m3u8',
                                    type: 'application/x-mpegURL'
                                })
                                this.player.play()
                                .catch(e => {
                                    console.log('[VideoPlayer_streamOnline] play error. cannot automagically play')
                                })                                
                                clearInterval(interval)
                            }
                        })
                    },100)

                } else {
                    //console.log('[streamOnlineWatcher] stream is OFFLINE')
                    //this.player.src('')
                    //this.player.reset()
                    
                }
            },
            vod(){
                if (this.vod) {
                    
                    //console.log('[vodWatcher] setting player source to: https://stream.mpk.dynu.net/vod/'+this.vod)
                    this.player.src({
                        src: 'https://stream.mpk.dynu.net/vod/' + this.vod,
                        type: 'video/mp4'
                    })
                    this.player.play()
                    .catch(e => {
                        console.log('[VideoPlayer_vod] play error. cannot automagically play')
                    })
                }
            },
            playStream(){
                console.log('PlayStream is: '+ this.playStream + ' streamOnline is: '+this.streamOnline)
                if(this.streamOnline && this.playStream){
                    this.player.src({
                        src: '/hls/' + this.streamName + '.m3u8',
                        type: 'application/x-mpegURL'
                    })
                    this.player.play()                    
                }
            }

        },
        mounted: function() {
            console.log('[videoPlayer_created] setting videojs log level to off')
            this.player.log.level('off')
        }
    }
</script>

<style>

</style>