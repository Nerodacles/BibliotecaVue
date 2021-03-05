<template>
    <div>
        <sidebar></sidebar>
        <p>Welcome {{user.name}}</p>
        <p>You're from: {{user.title.name}}</p>
        <p>User Email: {{user.email}}</p>
        <p>You're Admin: {{user.isAdmin}}</p>
    </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import { auth } from '../firebase'
import { db } from '../firebase' 
import { usersCollection } from '../firebase' 

export default {
  components: { Sidebar },
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