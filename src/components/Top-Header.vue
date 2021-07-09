<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="dark" class="fixed-top bg-mix">
            <br>
            <b-navbar-brand href="/"><img src="@/assets/logo.svg" width="30" height="30" class="d-inline-block align-top" loading="lazy"><span class="text-sm-center">Virtual Library</span></b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item href="/login" v-if="!loggedIn">Login/Register</b-nav-item>
                    <b-nav-item href="/about">About</b-nav-item>
                </b-navbar-nav>

                <b-navbar-nav class="ml-auto" v-if="loggedIn">
                    <div>
                        <b-nav-item-dropdown size="lg" right variant="link" toggle-class="text-decoration-none" no-caret>
                            <template #button-content>
                                <div v-if="userNotifications[0]">
                                    <a>
                                        <span class="fas fa-bell"></span>
                                        <span class="badge badge-notify rounded-pill">{{userNotifications.length}}</span>
                                    </a>
                                </div>

                                <div v-if="!userNotifications[0]">
                                    <span class="far fa-bell"></span>
                                </div>
                            </template>
                            <b-dropdown-header id="dropdown-header-label">
                                <div v-if="this.userNotifications[0]">
                                    Notifications
                                </div>
                                <div v-if="!this.userNotifications[0]">
                                    You don't have notifications!
                                </div>
                            </b-dropdown-header>
                                <div v-for="notif in this.userNotifications" :key="notif.id">
                                    <div class="d-flex bd-highlight">
                                        <b-dropdown-item class="p-2 w-100 bd-highlight" :href="notif.href">{{notif.message}}</b-dropdown-item>
                                        <div class="p-2 flex-shrink-1 bd-highlight"><button class="btn btn-light" @click="deleteNotif(notif.id)"><span class="fas fa-times"></span></button></div>
                                    </div>
                                    <b-dropdown-divider></b-dropdown-divider>
                                </div>
                        </b-nav-item-dropdown>
                    </div>
                    <b-nav-item-dropdown right>
                        <template #button-content>
                            <em>{{userData.name}}</em>
                        </template>
                        <b-dropdown-item :href="'/profile/' + userUID">Profile</b-dropdown-item>
                        <b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
import { auth } from '../firebase'

export default {
    computed: {
        userData(){
            return this.$store.state.userProfile
        },
        userUID(){
            return this.$store.state.userUID
        },
        userNotifications(){
            return this.$store.state.notifications
        },
    },
    created() {
        auth.onAuthStateChanged(user=> {
            this.loggedIn = !!user;
            if(this.loggedIn){
                this.$store.dispatch('Getuser')
                this.$store.dispatch('getAuthUser')
                this.$store.dispatch('notificationStates',{state: 'get'})
                this.$store.dispatch('getBookData')
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
        deleteNotif(notifID){
            this.$store.dispatch('notificationStates',{state: 'del', notificationID: notifID})
        }
    }
}
</script>

<style lang="scss" scoped>
.bg-mix {
    background: linear-gradient(to right, #1d1b1b,#1d1b1b, #9b9b9b);
}

.badge-notify{
   background:red;
   width: 15px;
   height: 15px;
   position: absolute;
   display: flex;
   color: #fff;
   justify-content: center;
   align-items: center;
   top: 3px;
   right: -1px;
  }
  .container{
      margin-left: 0;
      margin-right: 0;
  }
</style>