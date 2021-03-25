// Vue
import Vue from 'vue'
import VueRouter from 'vue-router'

// Login/Register
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'

// Users
import User from '../views/user/index.vue'
import Profile from '../views/user/profile/_id.vue'

// Admin
import Admin from '../views/admin/index.vue'
import AddBook from '../views/admin/AddBook.vue'
import AdminBooks from '../views/admin/adminBook.vue'
import EditBooks from '../views/admin/editBook/_id.vue'

// Books
import Books from '../views/Books/Books.vue'
import Book from '../views/Books/book/_id.vue'

// Firebase Get users/databases/auth
import { auth } from '../firebase'
import { usersCollection } from '../firebase'
import { booksCollection } from '../firebase'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Books,
        meta: {requireAuth: true, title: 'Books'},
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {title: 'Login Page'},
        beforeEnter(to, from, next){
            if(auth.currentUser){
                next('/')
            } else next()
        }
    },
    {
        path: '/register',
        name: 'register',
        component: Register,
        meta: {title: 'Register Page'},
        beforeEnter(to, from, next){
            if(auth.currentUser){
                next('/')
            } else next()
        }
    },
    {
        path: '/about',
        name: 'About',
        meta: {title: 'About'},
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    },
    {
        path: '/user',
        name: 'user',
        component: User,
        meta: {requireAuth: true, title: 'User Page'}
    },
    {
        path: '/user/profile/:id',
        name: 'Profile',
        props: true,
        component: Profile,
        meta: {requireAuth: true, title: 'Profile'},
        beforeEnter(to, from, next){
            if(to.path != '/user/profile/'+auth.currentUser.uid){
                next('/user')
            } else next()
        },
    },
    // {
    //     path: '/Books',
    //     name: 'Books',
    //     component: Books,
    //     meta: {requireAuth: true}
    // },
    {
        path: '/book/:id',
        name: 'Book',
        props: true,
        component: Book,
        meta: {requireAuth: true, title: 'Book'}
    },
    {
        path: '/admin',
        name: 'admin',
        component: Admin,
        meta: {requireAuth: true, title: 'Admin Page'},
        beforeEnter(to, from, next){
            var user = []
            usersCollection.doc(auth.currentUser.uid).onSnapshot(snap=> {
                user = snap.data()
                if(user.isAdmin != true || user.isActive != true){
                    next("/")
                } else next()
            });
        }
    },
    {
        path: '/admin/AddBook',
        name: 'AddBook',
        component: AddBook,
        meta: {requireAuth: true, title: 'Add Books'},
        beforeEnter(to, from, next){
            var user = []
            usersCollection.doc(auth.currentUser.uid).onSnapshot(snap=> {
                user = snap.data()
                if(user.isAdmin != true || user.isActive != true){
                    next("/")
                } else next()
            });
        }
    },
    {
        path: '/admin/AdminBooks',
        name: 'AdminBooks',
        component: AdminBooks,
        meta: {requireAuth: true, title: 'Administrate Books'},
        beforeEnter(to, from, next){
            var user = []
            usersCollection.doc(auth.currentUser.uid).onSnapshot(snap=> {user = snap.data()
                if(user.isAdmin != true || user.isActive != true){
                    next("/")
                } else next()
            });
        }
    },
    {
        path: '/admin/editBook/:id',
        name: 'EditBooks',
        props: true,
        component: EditBooks,
        meta: {requireAuth: true, title: 'Edit Books'},
        beforeEnter(to, from, next){
            var user = [];var book = []
            booksCollection.doc(to.params.id).onSnapshot(snap=>{book = snap.data()
                usersCollection.doc(auth.currentUser.uid).onSnapshot(snap=> {user = snap.data()
                    if(user.isAdmin != true || user.isActive != true){
                        next("/")
                    } else 
                        if(book.user == auth.currentUser.uid || auth.currentUser.uid == 'sMRFpB1X1tMWFWfpcddok0K5Qav1'){ next() }
                });
            })
        }
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
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
