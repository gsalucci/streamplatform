<template>
    <video-player class="vjs-big-play-centered video-js vjs-default-skin vjs-fluid"  :options='playerOptions' ref="videoPlayer"></video-player>
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
                muted: true,
                fluid:true,
                autoplay: false,
                controls: true,
                techOrder: ['html5'],
                html5: { hls: { withCredentials: false } },
                //sources: []
                    // {
                    //     src: 'http://stream.mpk.dynu.net/hls/live.m3u8',
                    //     type: 'application/x-mpegURL'
                    // }
                // ],
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
        watch: {
            streamOnline() {
                if (this.streamOnline) {
                    console.log('[streamOnlineWatcher] stream is ONLINE')
                    console.log('[streamOnlineWatcher] setting player source to: '+process.env.VUE_APP_STREAM_BASE + this.streamName + '.m3u8')
                    this.player.src({
                        src: process.env.VUE_APP_STREAM_BASE + this.streamName + '.m3u8',
                        type: 'application/x-mpegURL'
                    })
                    this.player.play()


                } else {
                    console.log('[streamOnlineWatcher] stream is OFFLINE')
                    this.player.src({})
                }
            }
        }
    }
</script>

<style>

</style>