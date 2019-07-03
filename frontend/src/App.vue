<template>
  <v-app dark>
    <v-content>
      <v-container grid-list-md ma-0 pa-0 fluid>
        <v-layout row wrap @click="onClick">
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
import NoSleep from 'nosleep.js'
export default {
  name: 'App',
  components: {
    Stream,
    Chat
  },
  data () {
    return {
      noSleepEnabled: false,
      noSleep: new NoSleep()
    }
  },
  methods: {
    onClick() {
      console.log('[onClick] App click')
      this.noSleepEnabled ? console.log(this.noSleepEnabled) : this.noSleep.enable(); this.noSleepEnabled = true;
    }
  },
  updated: function () {
    console.log('[App] scrolling to bottom')
    document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;
  }
}
</script>
