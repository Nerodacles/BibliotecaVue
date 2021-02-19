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
import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'

export default {
    components: {'sidebar': Sidebar},
    created(){
        firebase.firestore().collection("roles").doc(firebase.auth().currentUser.uid).onSnapshot(snap=> {this.user = snap.data()});
        firebase.firestore().collection("default").onSnapshot(snap=> {
            this.defaultValues = [],
            snap.forEach(user=> {
            var client = user.data();
            client.id = user.id;
            this.defaultValues.push(client);
            });
        });
        firebase.firestore().collection("roles").onSnapshot(snap=> {
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