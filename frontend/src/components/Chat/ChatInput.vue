<template>
    <v-layout column>
        <v-layout row align-center>
            <v-flex xs11>
                <v-text-field v-model="input" :error="validationError" @input="validationError = false" :placeholder="placeholderText" @keyup.enter="onSubmit" clearable hide-details/>
            </v-flex>
            <v-flex class="mt-4 ml-0 mr-4">
                <v-btn flat icon  @click="onSubmit"><v-icon>send</v-icon></v-btn>
            </v-flex>
        </v-layout>
        <v-layout row align-center justify-space-around v-if="!chatUser">
            <v-flex>
                <v-switch v-model="adminSwitch" label="As Admin"/>
            </v-flex>            
        </v-layout>
        <v-layout row align-center justify-start>
            <v-flex xs11 v-if="adminSwitch">
                <v-text-field
                    v-model="password"
                    :append-icon="showPw ? 'visibility' : 'visibility_off'"
                    :type="showPw ? 'text' : 'password'"
                    @click:append="showPW = !showPw"
                    placeholder="Password"
                ></v-text-field>
            </v-flex>
        </v-layout>
    </v-layout>    
</template>

<script>
import {mapGetters} from 'vuex'
    export default {
        data(){
            return {
                input:'',
                validationError: false,
                adminSwitch: false,
                showPw: false,
                password:''
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
                        if (this.adminSwitch && this.password == process.env.VUE_APP_ADMIN_PASSWORD){
                            console.log('[ChatInput_onSubmit] Admin user authenticated')
                            let chatUser = {name: this.input, color: this.getRandomColor(),admin: true}
                        } else {
                            let chatUser = {name: this.input, color: this.getRandomColor()}
                        }
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