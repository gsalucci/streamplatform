<template>
    <v-layout column align-start height="100%" class="chatHistory" id="chatBox">
        <div v-for="message in chatHistory" :key="message.id" class="chatMessage">
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
    </v-layout>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        data(){
            return {
                chatBox: undefined,
            }
        },
        components: {},
        computed: {
            ...mapGetters(['chatUser','chatHistory'])
        },
        updated() {
            this.chatBox = document.getElementById('chatBox')
            console.log('[ChatHistory_updated] scrolling to bottom')
            this.chatBox.scrollTop = this.chatBox.scrollHeight;
        },
        watch: {
            chatHistory: function () { 
            this.$nextTick(function () {
                console.log('[ChatHistory_watch] scrolling to bottom')
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
    right: 20px;
	background: #005c64;
	border-radius: .4em;
    padding: 8px;
    margin-top: 10px;
    margin-bottom: 10px;
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