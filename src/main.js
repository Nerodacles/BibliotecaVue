import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios"
import { auth } from './firebase'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueToastr from "vue-toastr";
import VueSidebarMenu from 'vue-sidebar-menu'


import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueToastr)
Vue.use(VueSidebarMenu)

Vue.prototype.$axios = axios
Vue.config.productionTip = false

let app
auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      components: {
        "vue-toastr": window.VueToastr
      },
      headers: {'Access-Control-Allow-Origin': 'Allow'},
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})