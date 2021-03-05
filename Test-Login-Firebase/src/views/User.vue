<template>
    <div>
        <p>Welcome {{user.name}}</p>
        <p>You're from: {{user.title}}</p>
        <p>User Email: {{user.email}}</p>
        <p>You're Admin: {{user.isAdmin}}</p>
    </div>
</template>

<script>
import { auth } from '../firebase'
import { db } from '../firebase' 
import { usersCollection } from '../firebase' 

export default {
    computed: {
    },
    created(){
        this.getUserData()
    },
    data:() => ({
        user: {},
    }),
    methods: {
        async getUserData(){
        await usersCollection.doc(auth.currentUser.uid).onSnapshot(snap=> {this.user = snap.data()});
        },
    },
}
</script>