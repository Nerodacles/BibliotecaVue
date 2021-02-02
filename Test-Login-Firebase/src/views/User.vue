<template>
    <div>
        <p>Welcome {{user.name}}</p>
        <p>You're from: {{user.uni}}</p>
        <p>{{user.name}}</p>
        <p>{{user.email}}</p>
        <p>{{user.isAdmin}}</p>
    </div>
</template>

<script>
import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'

export default {
    computed: {
    },
    created(){
        this.getUserData()
    },
    data:() => ({
        database: [],
        user: "",
    }),
    methods: {
        async getUserData(){
        await firebase.firestore().collection("roles").doc(firebase.auth().currentUser.uid).onSnapshot(snap=> {this.user = snap.data()});
        },
    },
}
</script>