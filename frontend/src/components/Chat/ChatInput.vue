<template>
    <v-layout row align-center>
        <v-flex xs11>
            <v-text-field v-model="input" :error="validationError" @input="validationError = false" :placeholder="placeholderText" @keyup.enter="onSubmit" clearable hide-details/>
        </v-flex>
        <v-flex class="mt-4 ml-0 mr-4">
            <v-btn flat icon  @click="onSubmit"><v-icon>send</v-icon></v-btn>
        </v-flex>
    </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'
    export default {
        data(){
            return {
                input:'',
                validationError: false,
            }
        },
        computed: {
            ...mapGetters([
                'chatUser'
            ]),
            placeholderText(){
                if (this.chatUser === undefined) return 'Choose a name...'
                else return 'Message...'
            }
        },
        methods: {
            getRandomColor() {
                let digits = 'ABCDEF';
                let color = '#'
                for (let i = 0; i<=5 ; i++){
                    color += digits[Math.floor(Math.random()*5)]
                }
                return color
            },
            onSubmit() {
                if (this.input!=''){
                    if (this.chatUser === undefined) {
                        let chatUser = {name: this.input, color: this.getRandomColor()}
                        this.$store.dispatch('joinChat', chatUser)
                        //console.log('[onSubmit] Storing cookie')
                        this.$cookies.set('chatUser',chatUser)
                        this.input = ''
                    } else {
                        this.$store.dispatch('sendChatMessage', {chatUser: this.chatUser,message: this.input})
                        this.input = ''
                    }
                }
                else this.validationError = true
            }
        },
        mounted() {
            let userFromCookie = this.$cookies.get('chatUser')
            //console.log('[mounted] checking user cookie: '+ JSON.stringify(userFromCookie))
            if (userFromCookie){
                //console.log('[mounted] user found')
                this.$store.dispatch('joinChat', userFromCookie)
            }
        }
    }
</script>

<style>
.inputBox {
    height: 100%;
    width: 100%;
    box-sizing:border-box;
}
</style>