<template>
    <div>
        Test
    </div>
</template>

<script>
import { db } from '../../firebase'
import { auth } from '../../firebase'

export default {
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