<template>
  <v-app dark>
    <!-- <v-content>
      <v-container grid-list-md ma-0 pa-0 fluid>
        <v-layout row wrap>
          <v-flex>
            <Stream/>
          </v-flex>
            <v-flex>
            <Chat/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content> -->
    <v-content>
      <v-layout column>
          <Stream/>
          <Chat/>
      </v-layout>
    </v-content>
  </v-app>
</template>

<script>
import Stream from './components/Stream/Stream'
import Chat from './components/Chat/Chat'
export default {
  name: 'App',
  components: {
    Stream,
    Chat
  },
  data () {
    return {
      //
    }
  },
  updated: function () {
    console.log('[App] scrolling to bottom')
    document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;
  },
  mounted: function() {
    console.log("MOUNTED!")
    window.scrollTo(0, 1);
  }
}
</script>
