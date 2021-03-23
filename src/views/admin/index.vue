<template>
    <div>
        Test
    </div>
</template>

<script>
import Swal from 'sweetalert2'
import { db } from '../../firebase'
import { auth } from '../../firebase'

export default {
    created(){
        Swal.fire()
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

<style>
@import '~@sweetalert2/themes/dark/dark.css';

</style>