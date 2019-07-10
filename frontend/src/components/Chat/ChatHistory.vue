<template>
    <v-layout column align-start height="100%" class="chatHistory" id="chatBox">
        <div v-for="message in chatHistory" :key="message.id" class="chatMessage" @click.stop="showMenu(message)">
            <v-layout row v-bind:reverse="chatUser.id === message.chatUser.id">
                <div v-bind:class="{ ownSpeechBubble: message.chatUser.id === chatUser.id, speechBubble: message.chatUser.id !== chatUser.id}">
                    <v-layout column justify-start align-start text-xs-left>
                        <div class="font-weight-bold" v-bind:style="{ color: message.chatUser.color}" v-if="!message.chatUser.banned">
                            {{message.chatUser.name}}
                        </div>
                        <div class="font-weight-bold" v-bind:style="{ color: message.chatUser.color}" v-if="message.chatUser.banned">
                            *Banned*
                        </div>
                        <div v-if="!message.muted && !message.chatUser.banned">
                            {{message.message}}
                        </div>
                        <div v-if="message.muted || message.chatUser.banned">
                            *MUTED*
                        </div>
                    </v-layout>
                </div>
            </v-layout>
        </div>
        <v-layout row justify-center v-if="menu">
            <v-dialog v-model="menu" v-if="selectedMessage"> 
                <!-- max-width="300"            -->
                <v-card>
                    <v-card-title>
                    <v-icon
                        large
                        left
                    >
                        supervisor_account
                    </v-icon>
                    <span class="title font-weight-light">Admin Panel</span>
                    </v-card-title>
                    <v-list>
                    <v-list-tile>
                        <v-list-tile-action>
                            <v-switch color="purple" v-model="mute"></v-switch>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>
                                mute: {{selectedMessage.message}}
                            </v-list-tile-title>
                        </v-list-tile-content>  
                    </v-list-tile>

                    <v-list-tile>
                        <v-list-tile-action>
                            <v-switch color="purple" v-model="ban"></v-switch>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>
                                ban: {{selectedMessage.chatUser.name}}
                            </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    </v-list>

                    <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn flat @click="menu = false">Cancel</v-btn>
                    <v-btn flat @click="takeAction()">Apply</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>      
    </v-layout>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        data(){
            return {
                chatBox: undefined,
                menu: false,
                mute: false,
                ban: false,
                selectedMessage: undefined,
            }
        },
        components: {},
        computed: {
            ...mapGetters([
                'chatUser',
                'chatHistory'
            ])
        },
        methods: {
            showMenu(message) {
                if (message) {
                    console.log('[ChatHistory_showMenu] setting selectedMessage to: ' + JSON.stringify(message))
                    this.selectedMessage = message
                    this.ban = this.selectedMessage.chatUser.banned
                    this.mute = this.selectedMessage.muted
                }
                if (this.chatUser.admin) this.menu = true;

                
            },
            takeAction() {
                if (this.mute != this.selectedMessage.muted) {
                    this.selectedMessage.muted = this.mute
                    this.$store.dispatch('muteMessage',this.selectedMessage)
                }
                if (this.ban != this.selectedMessage.chatUser.banned) {
                    this.selectedMessage.chatUser.banned = this.ban
                    this.$store.dispatch('banUser',this.selectedMessage.chatUser)
                }                
                this.ban = false
                this.mute = false
                this.selectedMessage = undefined
                this.menu = false
            }

        },
        updated() {
            this.chatBox = document.getElementById('chatBox')
            //console.log('[ChatHistory_updated] scrolling to bottom')
            this.chatBox.scrollTop = this.chatBox.scrollHeight;
        },
        mounted(){
            console.log('[ChatHistory_Mounted] chatHistory: '+JSON.stringify(this.chatHistory))
        },
        watch: {
            chatHistory: function () { 
            this.$nextTick(function () {
                //console.log('[ChatHistory_watch] scrolling to bottom')
                this.chatBox.scrollTop = this.chatBox.scrollHeight;
            });
            }
        }
    }
</script>

<style>
.chatHistory {
    /* height: 100px; */
    max-height: 100px;
    /* width: 100%; */
    overflow-y: auto;
    overflow-x:hidden;
}

.chatMessage {
    width: 100%;
}
.speechBubble {
	position: relative;
    left: 30px;
	background: #8d2663;
	border-radius: .4em;
    padding: 8px;
    margin-top: 10px;
    margin-bottom: 10px;
    max-width: 350px;
}

.speechBubble:after {
	content: '';
	position: absolute;
	left: 0;
	top: 50%;
	width: 0;
	height: 0;
	border: 20px solid transparent;
	border-right-color: #8d2663;
	border-left: 0;
	border-top: 0;
	margin-top: -10px;
	margin-left: -20px;
}

.ownSpeechBubble {
    position: relative;
    right: 30px;
	background: #005c64;
	border-radius: .4em;
    padding: 8px;
    margin-top: 10px;
    margin-bottom: 10px;
    max-width: 350px;
}

.ownSpeechBubble:after {
	content: '';
	position: absolute;
	right: 0;
	top: 50%;
	width: 0;
	height: 0;
	border: 20px solid transparent;
	border-left-color: #005c64;
	border-right: 0;
	border-top: 0;
	margin-top: -10px;
	margin-right: -20px;
}

</style>