<template>
    <v-layout column align-start height="100%" class="chatHistory" id="chatBox">
        <div v-for="message in chatHistory" :key="message.id" class="chatMessage" @click="menu = true">
            <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x v-if="chatUser.admin">
                <template v-slot:activator="{ on }">
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
                </template>
            
            <v-card>
                <v-list>
                <v-list-tile avatar>
                    <v-list-tile-avatar>
                    <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                    <v-list-tile-title>John Leider</v-list-tile-title>
                    <v-list-tile-sub-title>Founder of Vuetify.js</v-list-tile-sub-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                    <v-btn
                        :class="fav ? 'red--text' : ''"
                        icon
                        @click="fav = !fav"
                    >
                        <v-icon>favorite</v-icon>
                    </v-btn>
                    </v-list-tile-action>
                </v-list-tile>
                </v-list>

                <v-divider></v-divider>

                <v-list>
                <v-list-tile>
                    <v-list-tile-action>
                    <v-switch color="purple"></v-switch>
                    </v-list-tile-action>
                    <v-list-tile-title>Enable messages</v-list-tile-title>
                </v-list-tile>

                <v-list-tile>
                    <v-list-tile-action>
                    <v-switch color="purple"></v-switch>
                    </v-list-tile-action>
                    <v-list-tile-title>Enable hints</v-list-tile-title>
                </v-list-tile>
                </v-list>

                <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn flat @click="menu = false">Cancel</v-btn>
                <v-btn color="primary" flat @click="menu = false">Save</v-btn>
                </v-card-actions>
            </v-card>

            </v-menu>
        </div>
    </v-layout>
    
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        data(){
            return {
                chatBox: undefined,
                menu: false,
            }
        },
        components: {},
        computed: {
            ...mapGetters(['chatUser','chatHistory'])
        },
        updated() {
            this.chatBox = document.getElementById('chatBox')
            //console.log('[ChatHistory_updated] scrolling to bottom')
            this.chatBox.scrollTop = this.chatBox.scrollHeight;
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