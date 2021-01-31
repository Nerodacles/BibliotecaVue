<template>
    <div>
      Admin Page
      <span>
        <p>
          {{this.database}}
        </p>
      </span>
      <span>
        <nuxt-link v-for="user in database" :key="user.id" class="w-full md:w-1/5 py-1 px-3">
              <div class="text-white hover:text-gray-600">
                <div class="font-semibold text-base overflow-hidden whitespace-no-wrap overflow-dots md:w-full">Usuario: {{ user.email }}</div>
                <div class="font-semibold text-base overflow-hidden whitespace-no-wrap overflow-dots md:w-full">Esta Activo: {{ user.isActive }}</div>
                <div class="font-semibold text-base overflow-hidden whitespace-no-wrap overflow-dots md:w-full">Es Admin: {{ user.isAdmin }}</div>
              </div>
            </nuxt-link>
        <p>
          User is Admin? {{this.user}}
          <b-alert show>Default Alert</b-alert>
        </p>
      </span>
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
    firebase.firestore().collection("roles").doc(firebase.auth().currentUser.uid).onSnapshot(snap=> {this.user = snap.data().isAdmin});
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
    user: "",
  }),
  methods: {
  },
}
</script>

<style lang="scss" scoped>

</style>