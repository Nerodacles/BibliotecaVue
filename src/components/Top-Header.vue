<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="dark" class="fixed-top">
            <br>
            <b-navbar-brand href="/"><img src="@/assets/logo.svg" width="30" height="30" class="d-inline-block align-top" alt="" loading="lazy"> Virtual Library</b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item href="/login" v-if="!loggedIn">Login</b-nav-item>
                    <!-- <b-nav-item href="/user" v-if="loggedIn && !userData.isAdmin">Dashboard</b-nav-item>
                    <b-nav-item href="/admin" v-if="loggedIn && userData.isAdmin">Dashboard</b-nav-item> -->
                    <b-nav-item href="/register" v-if="!loggedIn">Register</b-nav-item>
                    <b-nav-item href="/about">About</b-nav-item>
                    <!-- <b-nav-item href="#" disabled>Disabled</b-nav-item> -->
                </b-navbar-nav>

                <b-navbar-nav class="ml-auto" v-if="this.loggedIn">
                    <b-nav-item-dropdown right>
                        <template #button-content>
                            <em>{{userData.name}}</em>
                        </template>
                        <!-- <b-dropdown-item :href="'/profile/' + userUID">Profile</b-dropdown-item> -->
                        <b-dropdown-item>Profile</b-dropdown-item>
                        <b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
import { auth } from '../firebase'
import { db } from '../firebase' 
import { usersCollection } from '../firebase' 

export default {
    computed: {
        userData(){
            return this.$store.state.userProfile
        },
        userUID(){
            return this.$store.state.userUID
        },
    },
    created() {
        auth.onAuthStateChanged(user=> {
            this.loggedIn = !!user;
            if(this.loggedIn){
                this.$store.dispatch('Getuser')
                this.$store.dispatch('getAuthUser')
            }
        });
    },
    data:() => ({
        loggedIn: false,
    }),

    methods: {
        logout() {
            this.$store.dispatch('logout')
        },
    }
}
</script>

<style lang="scss" scoped>
</style>