<template>
  <div class="">
    <div class="d-md-none d-lg-none d-xl-none">
      <div class="pos-f-t">
        <div class="collapse" id="navbarToggleExternalContent">
          <div class="bg-dark p-4">
            <h4 class="text-white">Collapsed content</h4>
            <span class="text-muted">Toggleable via the navbar brand.</span>
          </div>
        </div>
        <nav class="navbar navbar-dark bg-dark">
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
        </nav>
      </div>
    </div>
    <div>
      <button @click="signOut" v-if="this.loggedIn">Sign Out</button>
    </div>
  </div>
</template>

<script>
import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'

export default {
    computed: {
        // userAdmin(){
        //     return firebase.firestore().collection("roles").doc(firebase.auth().currentUser.uid).onSnapshot(snap=> {this.idAdmin = snap.data().isAdmin});
        // },
    },
    created() {
        firebase.auth().onAuthStateChanged(user=> {
            this.loggedIn = !!user;
        }),
        firebase.firestore().collection("roles").doc(firebase.auth().currentUser.uid).onSnapshot(snap=> {this.idAdmin = snap.data().isAdmin});
    },
    data:() => ({
        loggedIn: false,
        database: [],
        idAdmin: false
    }),
    methods: {
        async signOut(){
            try {
                // eslint-disable-next-line no-unused-vars
                const data = await firebase.auth().signOut();
                this.$router.replace({name: "login"})
            }
            catch(err) {
                console.log(err)
            }
        },
        async userAdmin(){
            return firebase.firestore().collection("roles").doc(firebase.auth().currentUser.uid).onSnapshot(snap=> {this.idAdmin = snap.data().isAdmin});
        },
    }
}
</script>

<style lang="scss" scoped>

</style>