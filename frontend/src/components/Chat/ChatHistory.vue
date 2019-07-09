<template>
    <v-layout column align-start height="100%" class="chatHistory" id="chatBox">
        <div v-for="message in chatHistory" :key="message.id" class="chatMessage" @click.stop="showMenu(message)">
            <v-layout row v-bind:reverse="chatUser.id === message.chatUser.id">
                <div v-bind:class="{ ownSpeechBubble: message.chatUser.id === chatUser.id, speechBubble: message.chatUser.id !== chatUser.id}">
                    <v-layout column justify-start align-start text-xs-left>
                        <div class="font-weight-bold" v-bind:style="{ color: message.chatUser.color}" v-if="message.chatUser !== chatUser">
                            {{message.chatUser.name}}
                        </div>
                        <div>
                            {{message.message}}
                        </div>
                    </v-layout>
                </div>
            </v-layout>
        </div>
        <v-layout row justify-center v-if="menu">
            <v-dialog v-model="menu" max-width="300" v-if="selectedMessage">            
                <v-card>
                    <v-list>
                    <v-list-tile>
                        <v-list-tile-action>
                        <v-switch color="purple" v-model="censor"></v-switch>
                        </v-list-tile-action>
                        <v-list-tile-title>Censor message: {{selectedMessage.message}}</v-list-tile-title>
                    </v-list-tile>

                    <v-list-tile>
                        <v-list-tile-action>
                        <v-switch color="purple" v-model="banUser"></v-switch>
                        </v-list-tile-action>
                        <v-list-tile-title>Ban User:</v-list-tile-title>
                    </v-list-tile>
                    </v-list>

                    <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn flat @click="menu = false">Cancel</v-btn>
                    <v-btn color="primary" flat @click="takeAction()">Apply</v-btn>
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
                selectedMessage: undefined,
                censor: false,
                banUser: false,
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
                    console.log('[ChatHistory_showMenu] setting selectedMessage to: ' + JSON.stringify(this.selectedMessage))
                    this.selectedMessage = message                    
                }
                if (this.chatUser.admin){
                    this.menu = true;
                    console.log('[ChatHistory_showMenu] opening menu')
                }
                
            },
            methods: {
                takeAction() {
                    if (this.censor) console.log('censoring message: '+this.selectedMessage.message+' written by: '+this.selectedMessage.chatUser.name)
                    if (this.ban) console.log('banning user'+this.selectedMessage.chatUser.name)
                    this.menu = false
                }
            },
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