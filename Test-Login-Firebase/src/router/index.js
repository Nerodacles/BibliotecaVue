import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Admin from '../views/Admin.vue'
import User from '../views/User.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import GetUser from '../views/GetUser.vue'

// Admin
import Books from '../views/admin/Books.vue'
import AddBook from '../views/admin/AddBook.vue'

//Usuarios
import Book from '../views/book/_id.vue'

//Autenticacion
import { auth } from '../firebase'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        // beforeEnter(to, from, next){
        //   if(auth().currentUser){
        //     next(false)
        //   } else next()
        // }
    },
    {
        path: '/register',
        name: 'register',
        component: Register,
        // beforeEnter(to, from, next){
        //     if(auth().currentUser){
        //         next(false)
        //     } else next()
        // }
    },
    {
        path: '/getuser',
        name: 'getuser',
        component: GetUser,
        // beforeEnter(to, from, next){
        //     if(!auth().currentUser){
        //         next("/")
        //     } else next()
        // }
    },
    {
        path: '/admin',
        name: 'admin',
        component: Admin,
        meta: {requireAuth: true},
        // beforeEnter(to, from, next){
        //     if(auth().currentUser.email != "admin@admin.com"){
        //         next("/admin")
        //     } else next()
        // }
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
    },
    {
        path: '/Books',
        name: 'Books',
        component: Books,
    },
    {
        path: '/book/:id',
        name: 'Book',
        props: true,
        component: Book,
    },
    {
        path: '/AddBook',
        name: 'AddBook',
        component: AddBook,
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next)=> {
    const requireAuth = to.matched.some(record => record.meta.requireAuth);
    if(requireAuth && !auth.currentUser){
        next("/login")
    }
    else{
        next()
    }
})

export default router
