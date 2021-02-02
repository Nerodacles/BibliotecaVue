<template>
    <div v-if="GetUser()"></div>
</template>

<script>
import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'

export default {
    data: () => ({
        userData:[],
    }),
    methods: {
        GetUser(){
            firebase.firestore().collection("roles").doc(firebase.auth().currentUser.uid).onSnapshot(snap=> {this.userData = snap.data()});
            if (this.userData.isAdmin) {this.$router.replace({ name: "admin" })}
            else if (this.userData.isAdmin == false) {this.$router.replace({ name: "user" })}
        }
    }
}
</script>