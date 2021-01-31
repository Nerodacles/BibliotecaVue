<template>
  <div id="app" class="">
    <top-header></top-header>
    <div id="nav">
      <router-link to="/login">Login</router-link>|
      <router-link to="/admin">Admin Page</router-link>|
      <router-link to="/user">User Page</router-link>|
      <router-link to="/register">Register</router-link>|
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons"></script>

<script>
import TopHeader from "./components/Top-Header"
import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'


export default {  
  created() {
    firebase.auth().onAuthStateChanged(user=> {
      this.loggedIn = !!user;
      firebase.firestore().collection("roles").doc(firebase.auth().currentUser.uid).onSnapshot(snap=> {this.idAdmin = snap.data().isAdmin});
    })
  },
  components: {'top-header': TopHeader}
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #0B2545;
  min-height: 100vh;
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #134074;
    &.router-link-exact-active {
      color: #8DA9C4;
    }
  }
}
</style>
