import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'
import router from '../router/index'
import { booksCollection } from '../firebase'
import { auth } from '../firebase'
import swal from 'sweetalert2'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userProfile: {},
        book: [],
        toggle: false,
        userUID: null,
    },
    mutations: {
        setUserProfile(state, val) {
            state.userProfile = val
        }
    },
    actions: {
        async login({ dispatch }, form) {
            // sign user in
            // const { user } = await auth.signInWithEmailAndPassword(form.email, form.password)
            const { user } = await auth.setPersistence("session").then(() => {
                return auth.signInWithEmailAndPassword(form.email, form.password)
            })
            .catch(function(error) {
                swal.fire({
                    title: 'Error!',
                    text: 'Credentials Invalid',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                })
            });

            // fetch user profile and set in state
            dispatch('fetchUserProfile', user)
        },
        async signup({ dispatch }, form) {
            // sign user up
            const { user } = await auth.createUserWithEmailAndPassword(form.email, form.password)
            
            // create user profile object in userCollections
            await fb.usersCollection.doc(user.uid).set({
                createdAt: Date(),
                name: form.name,
                title: form.uni,
                isActive: true,
                isAdmin: false
            }).catch(function(error) {
                swal.fire({
                    title: 'Error!',
                    text: 'Talk to the web administrators',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                })
            });

            // fetch user profile and set in state
            dispatch('fetchUserProfile', user)
        },
        async fetchUserProfile({ commit }, user) {
            // fetch user profile
            const userProfile = await fb.usersCollection.doc(user.uid).get()

            // set user profile in state
            commit('setUserProfile', userProfile.data())
            
            // change route to dashboard
            if(this.state.userProfile.isAdmin){
                router.push('/admin')
            }
            else{
                router.push('/user')
            }
        },
        async logout({ commit }) {
            await fb.auth.signOut()
            
            // clear userProfile and redirect to /login
            commit('setUserProfile', {})
            router.push('/login')
        },
        async newBook({ dispatch }, book){
            await booksCollection.doc(book.Name).set({
                // createdAt: Date(),
                coverUrl: book.covers,
                bookUrl: book.file,
                BookName: book.name,
                ISBN: book.ISBN,
                Categories: book.category,
                Description: book.description,
            })
        },
        async Getuser({commit}){
            const userProfile = await fb.usersCollection.doc(auth.currentUser.uid).get()
            commit('setUserProfile', userProfile.data())

            return this.state.userProfile
        },
        toggleSidebar({state}){
            state.toggle = !state.toggle
            return state.toggle
        },
        async getAuthUser({state}){
            state.userUID = await auth.currentUser.uid
        }
    }
})