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
        BookCollection: [],
        toggle: false,
        userUID: null,
    },
    mutations: {
        setUserProfile(state, val) {
            state.userProfile = val
        },
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
                    position: 'top-end',
                    icon: 'error',
                    title: 'Invalid Credentials',
                    showConfirmButton: false,
                    timer: 1500
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
            }).then(function(){
                swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'User Registed Successfully!',
                    showConfirmButton: false,
                    timer: 1500
                })
            }).catch(function(error){
                swal.fire({
                    title: 'Error!',
                    text: error,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                })
            });

            // fetch user profile and set in state
            dispatch('fetchUserProfile', user)
        },
        async fetchUserProfile({ commit, dispatch }, user) {
            // fetch user profile
            const userProfile = await fb.usersCollection.doc(user.uid).get()

            // set user profile in state
            commit('setUserProfile', userProfile.data())
            
            //change route to books
            // router.push('/')
            // change route to dashboard
            dispatch('dashboard')
        },
        async dashboard() {
            // change route to dashboard
            if(this.state.userProfile.isAdmin){
                router.push('/admin/AdminBooks')
            }
            else{
                router.push('/')
            }
        },
        async logout({ commit }) {
            await fb.auth.signOut()
            
            // clear userProfile and redirect to /login
            commit('setUserProfile', {})
            router.push('/login')
        },
        async newBook({ dispatch }, book){
            await booksCollection.doc().set({
                createdAt: Date(),
                coverUrl: book.covers,
                bookUrl: book.file,
                title: book.name,
                author: book.author,
                ISBN: book.ISBN,
                categories: book.category,
                description: book.description,
                user: book.user
            }).then(function() {
                swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `You succesfully added: ${book.name}`,
                    showConfirmButton: false,
                    timer: 1500
                })
            }).catch(function(error){
                swal.fire({
                    title: 'Error!',
                    text: error,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                })
            });
        },
        async editBook({dispatch},book){
            await booksCollection.doc(book.id).update({
                lastModified: Date(),
                title: book.bk.title,
                author: book.bk.author,
                ISBN: book.bk.ISBN,
                categories: book.bk.categories,
                description: book.bk.description,
            }).then(function() {
                swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `${book.bk.title} has been edited succesfully!`,
                    showConfirmButton: false,
                    timer: 2500
                }).then(function() {
                    router.push('/admin/AdminBooks')
                });
            }).catch(function(error){
                swal.fire({
                    title: 'Error!',
                    text: error,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                })
            });
        },
        async deleteBook({ dispatch },book){
            const swalWithBootstrapButtons = swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false
            })

            swalWithBootstrapButtons.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    // booksCollection.doc(book.id).delete()
                    swalWithBootstrapButtons.fire(
                    'Deleted!',
                    'The book was erased.',
                    'success'
                )
                } else if (
                    result.dismiss === swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire(
                        'Cancelled',
                        "The book wasn't erased.",
                        'error'
                    )
                }
            })
        },
        async Getuser({commit}){
            const userProfile = await fb.usersCollection.doc(auth.currentUser.uid).get()
            commit('setUserProfile', userProfile.data())

            return this.state.userProfile
        },
        async getAuthUser({state}){
            state.userUID = await auth.currentUser.uid
        }
    }
})