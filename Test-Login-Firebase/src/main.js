import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios"
import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/analytics"
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.prototype.$axios = axios
Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "AIzaSyCQpj6yylxEBIN7tRRCYUGRKLKIbUaadVA",
  authDomain: "biblioteca-vue.firebaseapp.com",
  projectId: "biblioteca-vue",
  storageBucket: "biblioteca-vue.appspot.com",
  messagingSenderId: "445771738959",
  appId: "1:445771738959:web:aecd278bf0fbd89eed1f3a",
  measurementId: "G-GKPXCHB9JK"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

let app;

// eslint-disable-next-line no-unused-vars
firebase.auth().onAuthStateChanged(user => {
  if(!app){
    app =
      new Vue({
        router,
        store,
        render: h => h(App)
      }).$mount('#app')
  }
})