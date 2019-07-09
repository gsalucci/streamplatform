# All-in-one Streaming Platform
All-in-one RTMP/HLS streaming platform easily deploayble via docker/caprover Includes NGINX configuration for optimal RTMP/HLS streaming, backend HTTP/WebSocket server to allow comunication from NGINX to the frontend, and realtime chat capabilities.

# Deployment
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

and then run it mapping the container ports to the host ports and the containers volume to the host folder we just created

```shell
docker run -d -p 80:80 -p 1935:1935 -p 8080:8080 -v /host/rec/folder:/var/rec a-name
```

# Streaming (OBS Studio)

* Settings/Stream 
  * Service: custom
  * Server: rtmp://yourHostName/live
  * Stream Key: yourStreamName (cannot be empty!)

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
    2. Socket.io: handles the comunication with the front-end and offers a very basic chat server

    ## Websocket messaging protocol
    Library: socket.io

    ## *Server => Client*

    ### Status update
    Event: 'status_update' fired at every socket connection, and at a fixed interval (default: 1000ms).

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
    Event `chat_message` fired when a client sends a chat message via the ['send_chat_message'](#send-chat-message) event.

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
    Event `left_chat` fired when a socket client, that previously joined the chat, disconnects.

    Payload is the [_chatUser_](#chat-user-object) object.

    ## *Client => Server*

    <a id='join-chat'></a>
    ### Join Chat
    Expected event name is: `join_chat`, with the expected payload being a [_chatUser_](#chat-user-object) object.

    <a id='send-chat-message'></a>
    ### Send Chat Message
    Expected event is `send_chat_message`

    expected payload is a [chatMessage](#chat-message-object)