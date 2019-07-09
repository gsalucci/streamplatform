<template>
        <!-- <v-card height="100%">
            <v-card-title primary-title>
                <v-icon>chat</v-icon>
                <v-layout row justify-center>
                    <h3 class="headline mb-0">Chat</h3>
                </v-layout>
            </v-card-title>
            <v-card-text >
                <ChatHistory/>
                <Notification v-if="notification"/>
            </v-card-text>
            <v-card-actions class="pa-3">
                <ChatInput/>   
            </v-card-actions>
        </v-card> -->
        <v-layout column>
            <v-flex xs12>
                <v-container ml-2 mt-2 mb-0 mr-0 pa-0 fluid>
                    <v-layout row>
                        <v-flex xs2><v-icon>chat</v-icon></v-flex>
                        <v-flex xs8 class="text-xs-center"><h3 class="headline mb-0">Chat</h3></v-flex>
                        <v-flex xs2 v-if="chatUser"><v-btn icon @click="leaveChat">
                                <v-icon>exit_to_app</v-icon>
                            </v-btn></v-flex>
                    </v-layout>
                    <ChatHistory/>
                    <Notification v-if="notification"/>
                    <ChatInput />                    
                </v-container>
            </v-flex>
        </v-layout>
</template>

<script>
    import ChatHistory from './ChatHistory'
    import ChatInput from './ChatInput'
    import Notification from '../Notification'
    import {mapGetters} from 'vuex'
    export default {
        data() {
            return {}
        },
        components: {
            ChatHistory,
            ChatInput,
            Notification
        },
        computed: {
            ...mapGetters(['notification','chatUser'])
        },
        methods: {
            leaveChat() {
                if(!this.chatUser.banned) {
                    console.log('[leaveChat] deleting cooke')
                    this.$cookies.remove('chatUser')
                    this.$store.dispatch('leaveChat',this.chatUser)
                }
            }
        },
        
    }
</script>

<style lang="scss" scoped>

</style>