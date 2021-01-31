<template>
    <div>
      <p>Welcome {{user.name}}</p>
      <p>You're from: {{user.university}}</p>
      <p>{{user.name}}</p>
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
  },
  data:() => ({
    database: [],
    user: "",
  }),
  methods: {
  },
  }
</script>

<style lang="scss" scoped>

</style>