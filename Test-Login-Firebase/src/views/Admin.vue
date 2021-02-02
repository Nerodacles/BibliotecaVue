<template>
    <!-- <div class="container">
        <div class="row">
            <div class="col-lg-0">test</div>
            <div class="col-lg-10">test</div>
        </div>
    </div> -->

    <div class="container">
    <div class="row Screen">
        <div class="col-sm-3 col-md-2 col-lg-1">TEST</div>
        <div class="col-sm-9 col-md-10 col-lg-11">TEST</div>
    </div>
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
    }),
    methods: {
    },
}
</script>