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
        notifications: [],
        BookCollection: [],
        bookID: [],
        userUID: null,
    },
    mutations: {
        setUserProfile(state, val) {
            state.userProfile = val
        },
        setBooks(state,val){
            state.BookCollection = val
        }
    },
    actions: {
        async login({ dispatch }, form) {
            // sign user in
            // const { user } = await auth.signInWithEmailAndPassword(form.email, form.password)
            const { user } = await auth.setPersistence("session").then(() => {
                return auth.signInWithEmailAndPassword(form.email, form.password)
            })
            .catch(function() { swal.fire({ position: 'top-end', icon: 'error', title: 'Invalid Credentials', showConfirmButton: false, timer: 1500 }) });

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
                swal.fire({ position: 'top-end', icon: 'success', title: 'User Registed Successfully!', showConfirmButton: false, timer: 1500
                })
            }).catch(function(error){ swal.fire({ title: 'Error!', text: error, icon: 'error', confirmButtonText: 'Ok' }) });

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
                user: book.user,
                isActive: true
            })
                .then(function() { 
                    swal.fire({ position: 'top-end', icon: 'success', title: `You succesfully added: ${book.name}`, showConfirmButton: false, timer: 1500 }),
                    dispatch('notificationStates',{state: 'set', title: book.name, category: book.category[0]})
                })
                .catch(function(error){ swal.fire({ title: 'Error!', text: error, icon: 'error', confirmButtonText: 'Ok' }) })
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
                swal.fire({ position: 'top-end', icon: 'success', title: `${book.bk.title} has been edited succesfully!`, showConfirmButton: false, timer: 2500})
                .then(function() { router.push('/admin/AdminBooks') })
            }).catch(function(error){swal.fire({ title: 'Error!', text: error, icon: 'error', confirmButtonText: 'Ok'})})
        },
        async deleteBook({ dispatch },book){
            const swalWithBootstrapButtons = swal.mixin({
                customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger'},
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
                    booksCollection.doc(book.id.id).delete().then(
                        fb.storage.refFromURL(book.id.coverUrl).delete().then(
                            fb.storage.refFromURL(book.id.bookUrl).delete().then(
                                swalWithBootstrapButtons.fire('Deleted!', 'The book was erased.', 'success')
                            ).catch(function(error) {swal.fire({position: 'top-end', icon: 'error', title: error.code, showConfirmButton: false, timer: 1500})})
                        ).catch(function(error) {swal.fire({position: 'top-end', icon: 'error', title: error.code, showConfirmButton: false, timer: 1500})})
                    ).catch(function(error) {swal.fire({position: 'top-end', icon: 'error', title: error.code, showConfirmButton: false, timer: 1500})})
                } else if (result.dismiss === swal.DismissReason.cancel) {swalWithBootstrapButtons.fire( 'Cancelled', "The book wasn't erased.", 'error') } 
            })
        },
        async commentActions({dispatch},comment){
            if (comment?.action == null) return swal.fire({position: 'top-end', icon: 'error', title: "Error", showConfirmButton: false, timer: 1500})
            if (comment.action == "create"){
                await booksCollection.doc(comment.id).collection("comments").doc().set({
                    bookID: comment.id,
                    user: comment.user,
                    username: comment.username,
                    message: comment.message,
                    date: comment.time,
                    likedCount: comment.likedCount,
                    isActive: true,
                }).then(function() {swal.fire({ position: 'top-end', icon: 'success', title: `Comment Created!`, showConfirmButton: false, timer: 1500})
                }).catch(function(error){swal.fire({ title: 'Error!', text: error, icon: 'error', confirmButtonText: 'Ok'})})
            }
            else if (comment.action == "delete"){
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
                        booksCollection.doc(comment.bookID).collection("comments").doc(comment.id).delete().then(
                            swalWithBootstrapButtons.fire('Deleted!', 'The comment was erased.', 'success')
                        ).catch(function(error) {swal.fire({position: 'top-end', icon: 'error', title: error.code, showConfirmButton: false, timer: 1500})})
                    } else if (
                        result.dismiss === swal.DismissReason.cancel
                    ) {
                        swalWithBootstrapButtons.fire(
                            'Cancelled',
                            "The comment wasn't erased.",
                            'error'
                        )
                    } 
                })
            }
            else if (comment.action == "update"){
                booksCollection.doc(comment.bookID).collection("comments").doc(comment.id).onSnapshot(snap=> {
                    let user = snap.data()
                    swal.fire({
                        title: 'Edit your comment!',
                        html: `<input type="text" id="comment" class="swal2-input" value="${user.message}" placeholder="Username">`,
                        confirmButtonText: 'Confirm',
                        focusConfirm: false,
                        preConfirm: () => {
                            const comment = swal.getPopup().querySelector('#comment').value
                            if (!comment) {
                                swal.showValidationMessage(`Please edit your comment!`)
                            }
                            return { comment: comment }
                        }
                        }).then(function(result) {
                            if (result.isConfirmed){
                                booksCollection.doc(comment.bookID).collection("comments").doc(comment.id).update({
                                    message: result.value.comment
                                }).then(function() {
                                    swal.fire({ position: 'top-end', icon: 'success', title: `Your comment has been edited succesfully!`, showConfirmButton: false, timer: 2500 })
                                }).catch(function(error){
                                    swal.fire({ title: 'Error!', text: error, icon: 'error', confirmButtonText: 'Ok' })
                                })
                            }
                        })
                })
            }
        },
        async likedState({dispatch}, data){
            if (data.liked){
                fb.usersCollection.doc(auth.currentUser.uid).collection('likedBooks').doc(data.bookID).delete()
                    // .then(swal.fire({ position: 'top-end', icon: 'success', title: `You dont like the book`, showConfirmButton: false, timer: 2500 }))
                    .catch(function(error){swal.fire({ title: 'Error!', text: error, icon: 'error', confirmButtonText: 'Ok' }) })
                return
            }

            fb.usersCollection.doc(auth.currentUser.uid).collection('likedBooks').doc(data.bookID).set({
                liked: true
            })  
                // .then(swal.fire({ position: 'top-end', icon: 'success', title: ``, showConfirmButton: false, timer: 2500 }))
                .catch(function(error){swal.fire({ title: 'Error!', text: error, icon: 'error', confirmButtonText: 'Ok' }) })

            // dispatch('Getuser')
        },
        async notificationStates({dispatch, commit}, data){
            if (data.state == 'get'){
                fb.usersCollection.doc(auth.currentUser.uid).collection('notifications').onSnapshot(snap=> {
                    this.state.notifications = []
                    snap.forEach(notif=> {
                        var notifData = notif.data()
                        notifData.id = notif.id
                        this.state.notifications.push(notifData)
                    })
                })
            }
            if (data.state == 'set'){
                dispatch('getBookData')
                dispatch('getBookData',{title: data.title})
                let book = null
                fb.usersCollection.onSnapshot(snap=> {
                    snap.forEach(user=> {
                        var userData = user.data();
                        userData.id = user.id;
                        fb.usersCollection.doc(userData.id).collection('likedBooks').onSnapshot(snap=> {
                            snap.forEach(likedBook=> {
                                var likedData = likedBook.data()
                                likedData.id = likedBook.id
                                for(book in this.state.BookCollection){
                                    if(this.state.BookCollection[book].id == likedData.id){
                                        if(this.state.BookCollection[book].categories[0] == data.category){
                                            fb.usersCollection.doc(userData.id).collection("notifications").doc().set({
                                                message: `This book may interest you: ${data.title}`,
                                                href: `/book/${this.state.bookID[0].id}`,
                                            }).catch(function(error){swal.fire({ title: 'Error!', text: error, icon: 'error', confirmButtonText: 'Ok'})})
                                            return
                                        }
                                    }
                                }
                            })
                        })
                    });
                });
            }
        },
        getBookData({state},data){
            if(!data){
                booksCollection.where('isActive', '==', true).onSnapshot(snap=>{
                    this.state.BookCollection = []
                    snap.forEach(test=> {
                        var data = test.data()
                        data.id = test.id
                        state.BookCollection.push(data)
                    })
                })
            }

            if(data){
                booksCollection.where('title','==',data.title).onSnapshot(snap=>{
                    this.state.bookID = []
                    snap.forEach(test=> {
                        var data = test.data()
                        data.id = test.id
                        this.state.bookID.push(data)
                    })
                })
            }


            return this.state.BookCollection
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