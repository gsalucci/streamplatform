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
                <v-container>
                    <v-layout row justify-start>
                        <v-icon>chat</v-icon>
                        <v-layout row justify-center>
                            <h3 class="headline mb-0">Chat</h3>
                        </v-layout>
                    </v-layout>                    
                </v-container>

            </v-flex>
            <v-flex xs12>
                <v-container>
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
            ...mapGetters(['notification'])
        }
        
    }
</script>

<style lang="scss" scoped>

</style>