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
          <v-list-tile-action @click="refreshVods">
            <v-icon>refresh</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-divider light/>
      <v-list>
        <v-list-tile v-for="v in vods" v-bind:key="v.mtime">
          <v-list-tile-content>
            <v-list-tile-title>
              {{v.name}}
            </v-list-tile-title>
            <v-list-tile-sub-title>
              date: {{new Date(v.mtime)}}
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action @click="playVod(v)">
            <v-icon>play</v-icon>
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

      <!-- <v-layout column justify-center hidden-lg-and-up>
        <v-flex>
          <Stream/>
        </v-flex>
        <v-flex>
          <Chat/>
        </v-flex>
      </v-layout>-->
    </v-content> 
  </v-app>
</template>

<script>
import Stream from './components/Stream/Stream'
import Chat from './components/Chat/Chat'
import {mapGetters} from 'vuex'
// import NoSleep from 'nosleep.js'
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
    ...mapGetters(['vods'])
  },
  methods: {
    refreshVods() {
      console.log('[App] Refreshing Vods')
      this.$store.dispatch('setVods')
    },
    playVod(v) {
      console.log('[App] playVod: '+JSON.stringify(v))
    }
    // onClick() {
    //   console.log('[onClick] App click')
    //   this.noSleepEnabled ? console.log(this.noSleepEnabled) : this.noSleep.enable(); this.noSleepEnabled = true;
    // }
  },
  updated: function () {
    console.log('[App] scrolling to bottom')
    document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;
  },
  created: function () {
    this.$store.dispatch('setHostname', location.host)
    this.$store.dispatch('setVods')
  }
}
</script>
