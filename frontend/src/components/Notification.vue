<template>
    <v-alert type="info" dismissible @click="dismiss" :value="true">{{content}}</v-alert>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {

        computed: {
            ...mapGetters(['notification']),
            content() {
                if (this.notification){
                    switch(this.notification.type){
                        case 'joined-chat':
                            return this.notification.data.name+' joined the chat'
                        case 'left-chat':
                            return this.notification.data.name+' left the chat'
                        case 'banned-user':
                            if (this.notification.data.banned) return 'User: '+this.notification.data.name+ ' has been banned.'
                            else return 'Ban for user: '+this.notification.data.name+ ' has been lifted.'
                    }

                }
                return JSON.stringify(this.notification)
            }
        } ,
        methods: {
            dismiss() {
                this.$store.commit('SET_NOTIFICATION',undefined)
            }
        },
    }
    
</script>

<style scoped>
    .notification{
        border: green solid;
        box-sizing:border-box;
    }
</style>