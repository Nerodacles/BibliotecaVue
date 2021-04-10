// Vue
import Vue from 'vue'
import VueRouter from 'vue-router'
import swal from 'sweetalert2'

// Login/Register
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'

// Users
import User from '../views/user/index.vue'
import Profile from '../views/user/profile/_id.vue'

// Admin
import Admin from '../views/admin/index.vue'
    //Admin CRUD Books
        import AddBook from '../views/admin/Books/Add.vue'
        import AdminBooks from '../views/admin/Books/Administrate.vue'
        import EditBooks from '../views/admin/Books/Edit/_id.vue'
    // Admin Comments
        import AdminComments from '../views/admin/comments'
    // Admin Users  
        import AdminUsers from '../views/admin/Users'

// Books
import Books from '../views/Books/Books.vue'
import Book from '../views/Books/book/_id.vue'
import AdvancedSearch from '../views/Books/AdvancedSearch.vue'

// Firebase Get databases/auth
import { auth, usersCollection, booksCollection } from '../firebase'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Books,
        meta: {requireAuth: true, title: 'Books'},
    },
    {
        path: '/Search',
        name: 'Search',
        component: AdvancedSearch,
        meta: {requireAuth: true, title: 'Search'},
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
        path: '/profile/:id',
        name: 'Profile',
        props: true,
        component: Profile,
        meta: {requireAuth: true, title: 'Profile'},
        beforeEnter(to, from, next){
            if(to.path != '/profile/' + auth.currentUser.uid){
                next('/')
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
        meta: {requireAuth: true, title: 'Book'},
        beforeEnter(to, from, next){
            let book = null
            booksCollection.doc(to.params.id).onSnapshot(snap=> { 
                book = snap.data()
                if(!book?.isActive){
                    next("/")
                }
                if(book?.isActive == undefined){
                    swal.fire({
                        icon: 'error',
                        title: 'Book Not Found',
                        timer: 4000
                    })
                }else next()
            })
        }
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
            })
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
    {
        path: '/admin/AdminComments',
        name: 'AdminComments',
        component: AdminComments,
        meta: {requireAuth: true, title: 'Administrate Comments'},
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
        path: '/admin/AdminUsers',
        name: 'AdminUsers',
        component: AdminUsers,
        meta: {requireAuth: true, title: 'Administrate Users'},
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
        path: '/404',
        name: '404',
        component: {
            template: '<h1 class="text-danger">Book Not Found!</h1>'
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
