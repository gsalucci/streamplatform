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
    vods: undefined,
    vod: undefined,
    playStream: true,

  },
  mutations: {
    SOCKET_CHAT_MESSAGE: (state, payload) => {
      //console.log("[SOCKET_CHAT_MESSAGE] chat message received: "+JSON.stringify(payload))
      state.chatHistory.push(payload)
    },
    SOCKET_STATUS_UPDATE: (state, payload) => {
      // payload: {streamName: <String>, online: <Boolean>, duration: <Number>, spectators: <Number>}
      ////console.log("[SOCKET_STATUS_UPDATE] status update received: "+JSON.stringify(payload))
      payload.streamName !== undefined ? state.streamName = payload.streamName : state.streamName = undefined;
      state.streamOnline = payload.online;
      state.streamDuration = payload.duration
      state.streamSpectators = payload.spectators
    },
    SET_NOTIFICATION: (state, payload) => {
      //console.log("[SET_NOTIFICATION] new notification: "+JSON.stringify(payload))
      state.notification = payload
      setTimeout(()=> {
        state.notification = undefined
      },3000)
    },
    SET_CHAT_USER: (state, payload) => {
      //console.log("[SET_CHAT_USER] setting chatUser to: "+JSON.stringify(payload))
      state.chatUser = payload
    },
    SET_CHAT_USER_PROP: (state, payload) => {
      console.log("[SET_CHAT_USER_PROP] setting chatUser's " + payload.prop + " status to: "+payload.newValue + "; was: "+ state.chatUser[payload.prop])
      state.chatUser[payload.prop] = payload.newValue
    },
    SET_HOSTNAME: (state, payload) => {
      //console.log("[SET_HOST_NAME] setting hostname to: "+JSON.stringify(payload))
      state.hostname = payload
    },
    SET_VODS: (state, payload) => {
      //console.log("[SET_VODS] setting vods to: "+JSON.stringify(payload))
      state.vods = payload.sort((a,b)=>{
        return new Date(b.mtime) - new Date(a.mtime)
      })
    },
    PLAY_VOD: (state,payload) => {
      state.vod = payload
    },
    CHANGE_MESSAGE_PROPERTY: (state, payload) => {
      /*
      payload: {
        id: massage-to-be-modified's id
        prop: property to modify
        newValue: i.e.
      }
      */
      let i = state.chatHistory.indexOf(state.chatHistory.find(m => m.id == payload.id))
      if (i >= 0){
        // console.log('changing message id: '+payload.id+' property: ' + payload.prop + ' to: ' + payload.newValue + '; was: '+ state.chatHistory[i][payload.prop])
        state.chatHistory[i][payload.prop] = payload.newValue
      }
      
    },
    CHANGE_CHAT_USER_PROPERTY: (state, payload) => {
      /*
      payload: {
        id: massage-to-be-modified's id
        prop: property to modify
        newValue: i.e.
      }
      */
     let i = state.chatHistory.indexOf(state.chatHistory.find(m => m.id == payload.id))
     if (i >= 0) {
      // console.log('changing message id: '+payload.id+'\'s chatUser\'s property: ' + payload.prop + ' to: ' + payload.newValue + '; was: '+ state.chatHistory[i].chatUser[payload.prop])
      state.chatHistory[i].chatUser[payload.prop] = payload.newValue
     }
    },
    PLAY_STREAM: (state, payload) => {
      console.log('[PLAY_STREAM] '+ payload)
      state.playStream = payload
    }
  },
  actions: {

    socket_joinedChat: (context, payload) => {
      //console.log('[socket_joinedChat] payload: '+JSON.stringify(payload))
      context.commit('SET_NOTIFICATION', {type: 'joined-chat', data: payload})
    },
    socket_leftChat: (context,payload) => {
      //console.log('[socket_leftChat] payload: '+JSON.stringify(payload))
      context.commit('SET_NOTIFICATION', {type: 'left-chat', data: payload})
    },
    socket_joinedOk: (context, payload) => {
      //console.log('[socket_joinOk] Chat joined confirmation received: '+JSON.stringify(payload))
      context.commit('SET_NOTIFICATION', {type: 'joined-chat', data: {name:'You', color: payload.color}})
      context.commit('SET_CHAT_USER', payload)
    },
    socket_bannedUser: (context, payload) => {
      console.log('[socket_bannedUser] applying banned status: '+payload.banned+' to all messages by user: '+payload.id)
      context.commit('SET_NOTIFICATION',{type:'banned-user',data: payload})
      context.state.chatHistory.forEach(m => {
        if(m.chatUser.id == payload.id) {
          context.commit('CHANGE_CHAT_USER_PROPERTY',{id: m.id,prop:'banned',newValue:payload.banned})
        }
      })
      console.log('[socket_bannedUser] own id: '+ context.state.chatUser.id + ' banned user id: '+payload.id)
      if (payload.id == context.state.chatUser.id) context.commit('SET_CHAT_USER_PROP',{prop:'banned',newValue: payload.banned})

    },
    socket_mutedMessage: (context, payload) => {
      console.log('[socket_mutedMessage] applying muted status: '+payload.muted+' to message id: '+payload.id)
      context.commit('CHANGE_MESSAGE_PROPERTY', {id: payload.id, prop:'muted', newValue: payload.muted})
    },
    joinChat: (context, payload) => {
      socket.emit('join_chat', payload)
    },
    leaveChat: (context,payload) => {
      console.log('[store_leaveChat] user: '+JSON.stringify(payload)+' is leaving the chat')
      socket.emit('leave_chat',payload)
      context.commit('SET_CHAT_USER',undefined)
    },
    sendChatMessage: (context,payload) => {
      //console.log('[sendChatMessage] sending message: '+JSON.stringify(payload))
      socket.emit('send_chat_message',payload)
      //context.commit('SOCKET_CHAT_MESSAGE', payload)
    },
    setHostname: (context, payload) => {
      context.commit('SET_HOSTNAME',payload)
    },
    setVods: context =>{
      //console.log('[setVods] Fetching vods list')
      fetch('/vod/')
        .then(res => res.json())
        .then(data => {
          let mp4s = []
          data.forEach(v => {
            if (v.name.split('.')[1] === 'mp4') mp4s.push(v)
          });
          context.commit('SET_VODS', mp4s)
        })
    },
    playVod: (context,payload) => {
      //console.log('[playVod] playing: '+payload)
      context.commit('PLAY_VOD',payload)
      context.commit('PLAY_STREAM',false)
    },
    banUser: (context, payload) => {
      console.log('[banUser] applying banned status: '+ payload.banned + ' to user id: ' + payload.id)
      socket.emit('ban_user',payload)
      context.commit('SET_NOTIFICATION',{type:'banned-user',data: payload})
      context.state.chatHistory.forEach(m => {
        if(m.chatUser.id == payload.id) {
          context.commit('CHANGE_CHAT_USER_PROPERTY',{id: m.id,prop:'banned',newValue:payload.banned})
        }
      })

    },
    muteMessage: (context, payload) => {
      console.log('[muteMessage] applying muted status: '+ payload.muted + ' to message id: ' + payload.id)
      socket.emit('mute_message',payload)
      context.commit('CHANGE_MESSAGE_PROPERTY',{id:payload.id, prop:'muted',newValue:payload.muted})
    },
    playStream: (context, payload) => {
      console.log('[playStream]' + payload)
      context.commit('PLAY_STREAM',payload)
      context.commit('PLAY_VOD', undefined)
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
    vods: state => state.vods,
    vod: state => state.vod,
    playStream: state=> state.playStream
  }
})
