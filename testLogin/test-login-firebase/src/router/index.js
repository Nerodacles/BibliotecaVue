import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Admin from '../views/Admin.vue'
import User from '../views/User.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Finishregister from '../views/Finishregister.vue'
import { firebase } from '@firebase/app'
import '@firebase/auth'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    beforeEnter(to, from, next){
      if(firebase.auth().currentUser){
        next("/user")
      } else next()
    }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    beforeEnter(to, from, next){
      if(firebase.auth().currentUser){
        next("/user")
      } else next()
    }
  },
  {
    path: '/finishregister',
    name: 'finishregister',
    component: Finishregister,
    // beforeEnter(to, from, next){
    //   if(firebase.auth().currentUser){
    //     next("/user")
    //   } else next()
    // }
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    meta: {requireAuth: true},
    beforeEnter(to, from, next){
      if(firebase.auth().currentUser.email != "admin@admin.com"){
        next("/admin")
      } else next()
    }
  },
  {
    path: '/user',
    name: 'user',
    component: User,
    meta: {requireAuth: true}
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next)=> {
  const requireAuth = to.matched.some(record => record.meta.requireAuth);
  const isAuthenticated = firebase.auth().currentUser;
  if(requireAuth && !isAuthenticated){
    next("/login")
  }
  else{
    next()
  }
})

export default router
