import io from 'socket.io-client';
// export default io(process.env.VUE_APP_SOCKET_IO)
export default io('https://stream.mpk.dynu.net')
