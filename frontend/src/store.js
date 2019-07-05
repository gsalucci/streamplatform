import Vue from 'vue'
import Vuex from 'vuex'
import socket from './socket-instance.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    streamName: undefined,
    streamOnline: false,
    streamDuration: 0,
    streamSpectators: 0,
    chatUser: undefined,
    chatHistory: [],
    notification: undefined,
    hostname: undefined,
    vods: undefined

  },
  mutations: {
    SOCKET_CHAT_MESSAGE: (state, payload) => {
      console.log("[SOCKET_CHAT_MESSAGE] chat message received: "+JSON.stringify(payload))
      state.chatHistory.push(payload)
    },
    SOCKET_STATUS_UPDATE: (state, payload) => {
      // payload: {streamName: <String>, online: <Boolean>, duration: <Number>, spectators: <Number>}
      //console.log("[SOCKET_STATUS_UPDATE] status update received: "+JSON.stringify(payload))
      payload.streamName !== undefined ? state.streamName = payload.streamName : state.streamName = undefined;
      state.streamOnline = payload.online;
      state.streamDuration = payload.duration
      state.streamSpectators = payload.spectators
    },
    SET_NOTIFICATION: (state, payload) => {
      console.log("[SET_NOTIFICATION] new notification: "+JSON.stringify(payload))
      state.notification = payload
      setTimeout(()=> {
        state.notification = undefined
      },3000)
    },
    SET_CHAT_USER: (state, payload) => {
      console.log("[SET_CHAT_USER] setting chatUser to: "+JSON.stringify(payload))
      state.chatUser = payload
    },
    SET_HOSTNAME: (state, payload) => {
      console.log("[SET_HOST_NAME] setting hostname to: "+JSON.stringify(payload))
      state.hostname = payload
    },
    SET_VODS: (state, payload) => {
      console.log("[SET_VODS] setting vods to: "+JSON.stringify(payload))
      state.vods = payload
    }

  },
  actions: {
    joinChat: (context, payload) => {
      socket.emit('join_chat', payload)
    },
    sendChatMessage: (context,payload) => {
      console.log('[sendChatMessage] sending message: '+JSON.stringify(payload))
      socket.emit('send_chat_message',payload)
      //context.commit('SOCKET_CHAT_MESSAGE', payload)
    },
    socket_joinedChat: (context, payload) => {
      console.log('[socket_joinedChat] payload: '+JSON.stringify(payload))
      context.commit('SET_NOTIFICATION', {type: 'joined-chat', data: payload})
    },
    socket_leftChat: (context,payload) => {
      console.log('[socket_leftChat] payload: '+JSON.stringify(payload))
      context.commit('SET_NOTIFICATION', {type: 'left-chat', data: payload})
    },
    socket_joinedOk: (context, payload) => {
      console.log('[socket_joinOk] Chat joined confirmation received: '+JSON.stringify(payload))
      context.commit('SET_NOTIFICATION', {type: 'joined-chat', data: {name:'You', color: payload.color}})
      context.commit('SET_CHAT_USER', payload)
    },
    setHostname: (context, payload) => {
      context.commit('SET_HOSTNAME',payload)
    },
    setVods: async function(context){
      console.log('Fetching vods list')
      context.commit('SET_VODS', await fetch('/vods/'))
    }


  },
  getters: {
    streamName: state => state.streamName,
    streamOnline: state => state.streamOnline,
    streamDuration: state => state.streamDuration,
    streamSpectators: state => state.streamSpectators,
    chatUsers: state => state.chatUsers,
    chatUser: state => state.chatUser,
    chatHistory: state => state.chatHistory,
    notification: state => state.notification,
    hostname: state => state.hostname,
    vods: state => state.vods
  }
})
