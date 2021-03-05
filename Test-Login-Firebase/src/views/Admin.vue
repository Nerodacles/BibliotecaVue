<template>
    <div>
        <div class="container">
            <div class="row Screen">
            </div>
        </div>
        <sidebar></sidebar>
    </div>
</template>

<script>
import Sidebar from "../components/Sidebar"
import { db } from '../firebase'
import { auth } from '../firebase'

export default {
    components: {'sidebar': Sidebar},
    created(){
        db.collection("users").doc(auth.currentUser.uid).onSnapshot(snap=> {this.user = snap.data()});
        db.collection("default").onSnapshot(snap=> {
            this.defaultValues = [],
            snap.forEach(user=> {
            var client = user.data();
            client.id = user.id;
            this.defaultValues.push(client);
            });
        });
        db.collection("users").onSnapshot(snap=> {
            this.database = [],
            snap.forEach(user=> {
            var client = user.data();
            client.id = user.id;
            this.database.push(client);
            });
        });
    },
    data:() => ({
        database: [],
        defaultValues: [],
        user: [],
    })
}
</script>