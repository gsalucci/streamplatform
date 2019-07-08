const app = require('express')();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 8080;

//To avoid error 400 behind nginx reverse proxy
io.set('transports', ["websocket", "polling"]);
prettyPrint = (method,endpoint, req) => {
    console.log(`[${method}: ${endpoint}]\nHeaders: ${JSON.stringify(req.headers)}\nBody: ${JSON.stringify(req.body)}`);
};

const updateInterval = 1000;
let sockets = {}
let chatUsers = {}
let chatHistory = []
let status = {
    streamName: undefined,
    online: false,
    duration: 0,
    spectators: 0
};

io.on('connection', socket => {
    console.log('Socket connected: ' + socket.id);
    sockets[socket.id]=socket;
    status.spectators = Object.keys(sockets).length
    socket.emit('status_update',status)

    socket.on('disconnect', () => {
        console.log('Socket disconnected: ' + socket.id)
        if (chatUsers[socket.id] !== undefined){
            socket.broadcast.emit('left_chat', chatUsers[socket.id])
        }
        delete sockets[socket.id]
        delete chatUsers[socket.id]
        status.spectators = Object.keys(sockets).length
    });

    socket.on('join_chat', data => {
        console.log("Socket: " + socket.id + " joined the chat with name: " + data.name + " color: "+ data.color)
        chatUsers[socket.id] = {id: socket.id, name: data.name, color: data.color, admin: data.admin};
        if(data.admin) console.log('socket: '+ socket.id +' logged in as admin')
        socket.emit('joined_ok',chatUsers[socket.id])
        socket.broadcast.emit('joined_chat', chatUsers[socket.id])
    });

    socket.on('leave_chat', data => {
        console.log(data.name + " leaves the chat")
        if (chatUsers[socket.id] !== undefined){
            socket.broadcast.emit('left_chat', chatUsers[socket.id])
        }
        delete chatUsers[socket.id]        
    });

    socket.on('send_chat_message',data => {
        let id = chatHistory.length + 1
        chatHistory.push({id: id, message: data.message, chatUser: data.chatUser});
        console.log("[" + data.chatUser.name + "] " + "says: " + data.message )
        Object.keys(sockets).forEach(k => {
            sockets[k].emit('chat_message',chatHistory[chatHistory.length-1]);
        });
    });

});

//inject VueApp
app.get('/', (req,res)=>{
    res.send('<h1>I\'m listening</h1>');
});

app.post('/on_publish',(req,res)=>{
    //prettyPrint('POST','on_publish',req);
    status.online = true;
    if (status.streamName === undefined){
        status.streamName = req.body.name
        console.log("Stream is online: "+status.streamName)
    }    
    res.status(200).send();
})

app.post('/on_done',(req,res)=>{
    //prettyPrint('POST','on_done',req);
    status.online = false;
    status.streamName = undefined;
    status.duration = 0;
    console.log("Stream is offline")
    res.status(200).send();
})

server.listen(port, () => {
    console.log("Listening on port: " + port)
})

setInterval(()=>{
    //console.log("Sending status update: "+ JSON.stringify(status))
    status.online ? status.duration+=updateInterval : status.duration = 0;
    Object.keys(sockets).forEach(k => {
        sockets[k].emit('status_update',status);
    });
},updateInterval);

app.post('/on_connect',(req,res)=>{
    //prettyPrint('POST','on_connect',req)
    res.status(200).send();
})

app.post('/on_play',(req,res)=>{
    //prettyPrint('POST','on_play',req)
    res.status(200).send();
})

app.post('/on_play_done',(req,res)=>{
    //prettyPrint('POST','on_play_done',req)
    res.status(200).send();
})

app.post('/on_publish_done',(req,res)=>{
    //prettyPrint('POST','on_publish_done',req)
    res.status(200).send();
})

app.post('/on_update',(req,res)=>{
    //prettyPrint('POST','on_update',req)
    res.status(200).send();
})