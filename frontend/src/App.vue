<template>
  <v-app dark>
    <v-navigation-drawer dark v-model="drawer" app clipped>
      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="/android-icon-192x192.png">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>Past Streams</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action >
            <v-btn icon @click="refreshVods">
              <v-icon>refresh</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-divider light/>
      <v-list v-if="streamOnline">
        <v-list-tile @click.stop="playLiveStream()">
          <v-list-tile-content>
            <v-list-tile-title>
              <v-layout row justify-start>
                <v-icon class="mr-2">live_tv</v-icon>{{streamName}}
              </v-layout>
            </v-list-tile-title>
            <v-list-tile-subtitle>
              LIVE
            </v-list-tile-subtitle>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon @click.stop="playLiveStream()" >chevron_right</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-list>
        <v-divider light v-if="streamOnline"/>
        <v-list-tile v-for="v in vods" v-bind:key="v.mtime" @click="playVod(v)">
          <v-list-tile-content>
            <v-list-tile-title>
              <!-- {{v.name.split('_')[0]}} -->
              {{v.name.split('.')[0]}}
            </v-list-tile-title>
            <v-list-tile-sub-title>
              {{formatDate(v.mtime)}}
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon @click="playVod(v)">
              <v-icon>chevron_right</v-icon>
            </v-btn>           
          </v-list-tile-action>
        </v-list-tile>
      </v-list>

    </v-navigation-drawer>
    <v-toolbar dark app clipped-left>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Streaming Platform</v-toolbar-title>
    </v-toolbar>
    
    <v-content>
      <v-container grid-list-md ma-0 pa-0 fluid>
        <v-layout row wrap>
          <v-flex style="width: 750px">
            <Stream/>
          </v-flex>
            <v-flex style="width:750px">
            <Chat/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content> 
  </v-app>
</template>

<script>
import Stream from './components/Stream/Stream'
import Chat from './components/Chat/Chat'
import {mapGetters} from 'vuex'
export default {
  name: 'App',
  components: {
    Stream,
    Chat
  },
  data () {
    return {
      drawer: false
    }
  },
  computed: {
    ...mapGetters(['vods','streamOnline','streamName'])
  },
  methods: {
    refreshVods() {
      //console.log('[App] Refreshing Vods')
      this.$store.dispatch('setVods')
    },
    playVod(v) {
      //console.log('[App] playVod: '+JSON.stringify(v))
      this.$store.dispatch('playVod',v.name)
      this.drawer = false
    },
    playLiveStream() {
      console.log('[App] playStream: dispatching action')
      this.$store.dispatch('playStream',true)
      this.drawer = false
    },
    formatDate(d){
      return new Date(d).toLocaleDateString(navigator.language || navigator.userLanguage,{year:'2-digit',month:'short',day:'2-digit',hour:'2-digit',minute:'2-digit'})
    }
  },
  created: function () {
    this.$store.dispatch('setHostname', location.host)
    this.$store.dispatch('setVods')
  }
}
</script>
