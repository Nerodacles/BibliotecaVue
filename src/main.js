import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { auth, analytics } from './firebase'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueSidebarMenu from 'vue-sidebar-menu'
import VueMeta from 'vue-meta'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import JwPagination from 'jw-vue-pagination'

Vue.component('pagination', JwPagination)
Vue.use(VueMeta)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueSidebarMenu)

Vue.config.productionTip = false
Vue.prototype.$analytics = analytics

let app
auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      headers: {'Access-Control-Allow-Origin': 'Allow', 'SameSite': 'secure'},
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})