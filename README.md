# All-in-one Streaming Platform
All-in-one RTMP/HLS streaming platform with adaptive bitrate easily deploayble via docker/caprover Includes NGINX configuration for optimal RTMP/HLS streaming, backend HTTP/WebSocket server to allow comunication from NGINX to the frontend, and realtime (moderatable) chat capabilities.

# Deployment

## Docker
This application is designed to be deployed via [docker](https://docs.docker.com/install/), using the included `Dockerfile`

First step is to clone the repo and edit the file inside `/path/to/repo/frontend` named `.env.production`

```shell
git clone repoUrl
cd /path/to/repo/frontend
nano .env.production
```

inside this file you will setup the administrator password that the client will use

```
VUE_APP_ADMIN_PASSWORD=SuperSafeAdminPassword
```

To run the app, we need to build a docker image giving it a name (only lowercase allowed)
```shell
cd /path/to/repo
docker build -t a-name .
```
while it's building we can create and set the permissions to the host folder where our streams will be recorded
```shell
mkdir /host/rec/folder
sudo chmod 777 /host/rec/folder
```

when the build process completes we can run the newly created image mapping the container's ports to the host's ports and the container's volume to the host's folder we just created

```shell
docker run -d -p 80:80 -p 1935:1935 -p 8080:8080 -v /host/rec/folder:/var/rec a-name
```

## Caprover
This app can be deployed to caprover wich is an:
> Automated Scalable PaaS Package (automated Docker+nginx) - Heroku on Steroids

more info [here](https://caprover.com/)

Deploying on caprover via the online dashboard is really easy:
1. clone this repo
2. set your administration password in: `/path/to/repo/frontend/.env.production`
3. add all the contents of the repo folder to a `.tar` archive
4. create a local directory where to save you stream and set permissions:
```shell
mkdir /host/rec/folder
sudo chmod 777 /host/rec/folder
```   
4. name and create a new app, tick the "Has persistent data" checkbox
5. manage your newly created app, set the following port mappings
   1. 1935:1935 (RTMP port)
   2. 8080:8080 (express and socket.io port)
6. add a persistent directory:
   1. Path in App: `/var/rec`
   2. click on: `Set specific host path`
   3. input the path of the directory created on step 4
7. go to the `deployment` tab, upload the `.tar` archive created at step 3
8. enjoy.

## Port Forwarding
If you want to stream from anywhere outside your local network you will need to set up a port forwarding rule for port `1935` (RTMP) on your router to your host machine.
Same goes for port `80`, if you want your app to be reachable from outside your local network.

# Streaming (OBS Studio)

* Settings/Stream 
  * Service: custom
  * Server: rtmp://yourHostName/live
  * Stream Key: yourStreamName **must be filled, no spaces/special characters allowed**

# Watching
You can watch the stream via the included client, just by visiting: `http(s)://yourHostName`, the included client will show information about stream status in real time including number of connected clients, stream duration, and will also offer a very basic real time chat.

If you dont want to use the included client, you can find the `.m3u8` playlists at [these](#playlist-endpoints) endpoints.

# Backend Docs
The backend of this application consists of 3 services:

1. ## NGINX configuration with RTMP and HLS module.

    Features:
    * **Adaptive bitrate streaming**
    
        The incoming stream is transcoded into 4 different *variants*:
        1. src: passthrough, same as incoming stream
        2. high: standard HD 720p variant
        3. mid: standard HQ 480p variant
        4. low: standard LQ 240p variant
   
        each variant is then added to the master playlist.
        the played variant will automatically be determined (client-independent) according to the connection's bitrate.

        <a id="playlist-endpoints"></a>
        The master playlist is served at:
        `http(s)://yourHostName/hls/yourStreamName.m3u8`


        if you want to test the individual hls variants you can open the relative playlist from:

        `http(s)://yourHostName/hls/yourStreamName_$variant$/index.m3u8`

        where $variant$ can be any of the names mentioned above.

    * **Stream recording**

        By default NGINX is configured to record your live streams, those will be saved to the containers internal path: `/var/rec`

2. ## Express and Socket.io

    This application handles the comunication between the NGINX webserver hosting the RTMP stream and the hosted front-end

    This application consists mainly of 2 servers:
    1. [Express](https://expressjs.com): Listens for POST requests coming from NGINX at specific endpoints, determines stream status and name.
    2. Socket.io: handles the comunication with the front-end and offers a chat server

    # Messaging protocol
    Library: socket.io

    ## *Server => Client*

    ### Stream Status update
    Event: 'status_update' emitted at every socket connection, and at a fixed interval (default: 1000ms).

    Payload is the status object:
    <a id='status-object'></a>
    ```JavaScript
    {
        streamName: String,
        online: Boolean,
        duration: Number,
        spectators: Number
    }
    ```
    ### Joined Chat and Joined Ok
    * `joined_chat` broadcasted when a client joins the chat with the ['join_chat'](#join-chat) message.

    * `join_ok` is sent back to the client requesting to join the chat. 

    Payload for both is the _chatUser_ object:
    <a id='chat-user-object'></a>
    ```JavaScript
    {
        id: Number, //socket.id
        name: String,
        color: String,
        admin: Boolean,
        banned: Boolean
    }
    ```
    ### Chat Message
    Event `chat_message` emitted when a client sends a chat message via the ['send_chat_message'](#send-chat-message) event.

    Payload is the _chatMessage_ object:
    <a id='chat-message-object'></a>
    ```JavaScript
    {
        id: Number,
        chatUser:
        {
            id: Number,
            name: String,
            color: String,
            admin: Boolean
        },
        message: String,
        muted: Boolean
    }
    ```
    ### Left Chat
    Event `left_chat` emitted when a socket client, that previously joined the chat, disconnects.

    Payload is the [_chatUser_](#chat-user-object) object.

    ### Banned User
    Event `banned_user` is emitted when a socket client, with administrative priviledges, emits the ['ban_user'](#ban-user) event.

    Payload is a [_chatUser_](#chat-user-object) object.

    ### Muted Message
    Event `muted_message` is emitted when a socket client, with administrative priviledges, emits the ['mute_message'](#mute-message) event.

    Payload is a [_chatMessage_](#chat-message-object) object.

    ## *Client => Server*

    <a id='join-chat'></a>
    ### Join Chat
    Expected event name is: `join_chat`, with the expected payload being a [_chatUser_](#chat-user-object) object.

    Administrator authentication is handled by the client

    <a id='send-chat-message'></a>
    ### Send Chat Message
    Expected event name is: `send_chat_message`

    Expected payload is a [chatMessage](#chat-message-object) object.

    <a id='ban-user'></a>
    ### Ban User
    Expected event name is: `ban_user`.
    
    Expected payload is: a [chatUser](#chat-user-object) object.

    <a id='mute-message'></a>
    ### Mute Message
    Expected event name is: `mute_message`.
    
    Expected payload is: a [chatMessage](#chat-message-object) object.

# Frontend Docs
The frontend of this application consists of a *SPA*, built using the [Vue.js]() framework, styling, inspired by the: "material design" specifications is handled by the [Vuetify.js]() module, while the playback of the live stream and VoDs is handled by [video.js]() player; the comunication with the backend is handled by a Socket.io [client]().

Application's status is managed using a [Vuex]() store, mutations and actions due to the asyncronous nature of the operations.

A great part of the responsibilities of this application lie on the frontend. 
It has to be able to:
1. handle comunication with the backend
2. play both HLS live streams and `.mp4` VoDs
3. handle user authentication and authorization
4. store user session
5. look good both on desktop and mobile
6. be able to "add to the homescreen" 