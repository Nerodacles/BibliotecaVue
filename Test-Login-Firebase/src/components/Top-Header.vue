<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
            <b-navbar-brand href="/"><img src="@/assets/logo.svg" width="30" height="30" class="d-inline-block align-top" alt="" loading="lazy"> Biblioteca Virtual JM</b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item href="/login" v-if="!loggedIn">Login</b-nav-item>
                    <b-nav-item href="/user" v-if="loggedIn && !userData.isAdmin">Home</b-nav-item>
                    <b-nav-item href="/admin" v-if="loggedIn && userData.isAdmin">Home</b-nav-item>
                    <b-nav-item href="/register" v-if="!loggedIn">Register</b-nav-item>
                    <b-nav-item href="/about">About</b-nav-item>
                    <!-- <b-nav-item href="#" disabled>Disabled</b-nav-item> -->
                </b-navbar-nav>

                <b-navbar-nav class="ml-auto" v-if="this.loggedIn">
                    <b-nav-item-dropdown right>
                        <template #button-content>
                            <em>{{userData.name}}</em>
                        </template>
                        <b-dropdown-item href="/">Profile</b-dropdown-item>
                        <b-dropdown-item @click="signOut">Sign Out</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'

export default {
    computed: {
    },
    created() {
        firebase.auth().onAuthStateChanged(user=> {
            this.loggedIn = !!user;
            this.GetUserData()
        });
    },
    data:() => ({
        loggedIn: false,
        userData: {},
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
        async GetUserData(){
            await firebase.firestore().collection("roles").doc(firebase.auth().currentUser.uid).onSnapshot(snap=> {this.userData = snap.data()});
        }
    }
}
</script>

<style lang="scss" scoped>

</style>