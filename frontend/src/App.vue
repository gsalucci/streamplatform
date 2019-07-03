<template>
  <v-app dark>
    <v-toolbar dark flat>
      <v-toolbar-title>Stream Platform</v-toolbar-title>
    </v-toolbar>
    <v-container grid-list-md ma-0 pa-0 fluid>
      <v-layout row wrap>
        <v-flex style="width: 1000px">
          <Stream/>
        </v-flex>
        <v-flex style="width: 300px">
          <Chat/>
        </v-flex>
      </v-layout>

    </v-container>
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
  }
}
</script>
