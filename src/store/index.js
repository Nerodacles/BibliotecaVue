import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'
import router from '../router/index'
import { booksCollection, auth, db, } from '../firebase'
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
        BooksInfo: {users: [], likeds: [], comments: []},
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
            .catch(function() { swal.fire({ position: 'top-end', icon: 'error', title: 'Invalid Credentials', showConfirmButton: false, timer: 1500 }) })

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
            }).then(function(){ swal.fire({ position: 'top-end', icon: 'success', title: 'User Registed Successfully!', showConfirmButton: false, timer: 1500 })
            }).catch(function(error){ swal.fire({ title: 'Error!', text: error, icon: 'error', confirmButtonText: 'Ok' }) })

            // fetch user profile and set in state
            dispatch('fetchUserProfile', user)
        },
        async recoverpass({ dispatch }, form) {
            auth.sendPasswordResetEmail(form.email)
            .then(function(){ swal.fire({title: 'Password Reset', text:'Recovery email sent sucessfully!', icon:'success', confirmButtonText: 'Ok'})
                .then(function() { router.push('/login') }) })
            .catch(function(error){ swal.fire({ title: 'Error!', text: error, icon: 'error', confirmButtonText: 'Ok' }) })
        },
        async fetchUserProfile({ commit, dispatch }, user) {
            // fetch user profile
            const userProfile = await fb.usersCollection.doc(user.uid).get()

            // set user profile in state
            commit('setUserProfile', userProfile.data())

            // change route to books
            // router.push('/')

            // change route to dashboard
            dispatch('dashboard')
        },
        async dashboard() {
            // change route to dashboard
            if(this.state.userProfile.isAdmin){
                // return router.push('/admin/AdminBooks')
                return router.push('/admin/AddBook')
            }
            router.push('/')
        },
        async logout({ commit }) {
            await fb.auth.signOut()
            
            // clear userProfile and redirect to /login
            commit('setUserProfile', {})
            router.push('/login')
        },
        async userActions({dispatch}, user){
            if (user?.action == null ) return
            if (user.action == 'updateLVL'){
                fb.usersCollection.doc(user.id).update({ isAdmin: user.isAdmin })
            }
            if (user.action == 'disable'){
                fb.usersCollection.doc(user.id).update({ isActive: user.isActive })
            }
        },
        async bookActions({ dispatch }, book){
            if (book?.action == null ) return
            if (book.action == 'create'){
                await booksCollection.add({
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
                    .then(function(docRef) { 
                        swal.fire({ position: 'top-end', icon: 'success', title: `You succesfully added: ${book.name}`, showConfirmButton: false, timer: 1500 })
                        dispatch('notificationStates',{state: 'set', title: book.name, category: book.category[0], bookID: docRef.id})
                    })
                    .catch(function(error){ swal.fire({ title: 'Error!', text: error, icon: 'error', confirmButtonText: 'Ok' }) })
            }
            if (book.action == 'update'){
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
            }
            if (book.action == 'delete'){
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
            }
            if (book.action == 'disable'){
                booksCollection.doc(book.id).update({ isActive: book.isActive })
            }
        },
        async commentActions({dispatch},comment){
            if (comment?.action == null) return swal.fire({position: 'top-end', icon: 'error', title: "Error", showConfirmButton: false, timer: 1500})
            if (comment.action == "create"){
                await db.collection(`/books/${comment.bookID}/comments`).add({
                    bookID: comment.bookID,
                    user: comment.user,
                    username: comment.username,
                    message: comment.message,
                    date: comment.time,
                    likedCount: comment.likedCount,
                    isActive: true,
                })
                    // .then(function() {swal.fire({ position: 'top-end', icon: 'success', title: `Comment Created!`, showConfirmButton: false, timer: 1500}) })
                    .catch(function(error){swal.fire({ title: 'Error!', text: error, icon: 'error', confirmButtonText: 'Ok'})})
            }
            if (comment.action == "delete"){
                const swalWithBootstrapButtons = swal.mixin({
                    customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
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
                        db.collection(`/books/${comment.bookID}/comments/`).doc(comment.id).delete().then(
                            swalWithBootstrapButtons.fire('Deleted!', 'The comment was erased.', 'success')
                        ).catch(function(error) {swal.fire({position: 'top-end', icon: 'error', title: error.code, showConfirmButton: false, timer: 1500})})
                    } else if (result.dismiss === swal.DismissReason.cancel) { swalWithBootstrapButtons.fire( 'Cancelled', "The comment wasn't erased.", 'error' ) } 
                })
            }
            if (comment.action == "update"){
                swal.fire({
                    title: 'Edit your comment!',
                    html: `<input type="text" id="comment" class="swal2-input" value="${comment.message}" placeholder="Edit this comment!">`,
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
                        db.collection(`/books/${comment.bookID}/comments/`).doc(comment.id).update({
                            message: result.value.comment
                        }).then(function() {
                            swal.fire({ position: 'top-end', icon: 'success', title: `The comment has been edited succesfully!`, showConfirmButton: false, timer: 2500 })
                        }).catch(function(error){
                            swal.fire({ title: 'Error!', text: error, icon: 'error', confirmButtonText: 'Ok' })
                        })
                    }
                })
            }
            if (comment.action == "disable"){
                db.collection(`/books/${comment.bookID}/comments/`).doc(comment.id).update({ isActive: comment.isActive })
            }
        },
        async likedState({dispatch}, data){
            if (data.liked){
                db.collection(`/users/${auth.currentUser.uid}/likedBooks/`).doc(data.bookID).delete()
                    // .then(swal.fire({ position: 'top-end', icon: 'success', title: `You dont like the book`, showConfirmButton: false, timer: 2500 }))
                    .catch(function(error){swal.fire({ title: 'Error!', text: error, icon: 'error', confirmButtonText: 'Ok' }) })
                return
            }

            db.collection(`/users/${auth.currentUser.uid}/likedBooks/`).doc(data.bookID).set({
                liked: true
            })  
                // .then(swal.fire({ position: 'top-end', icon: 'success', title: ``, showConfirmButton: false, timer: 2500 }))
                .catch(function(error){swal.fire({ title: 'Error!', text: error, icon: 'error', confirmButtonText: 'Ok' }) })

            // dispatch('Getuser')
        },
        async notificationStates({dispatch, commit, state}, data){
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
                
                var user = null
                var likeds = null
                var books = null
                var category = null
                
                for(user in state.BooksInfo.users){
                    dispatch('getBookData',{title: data.title})
                    var userHasBook = 0
                    for(likeds in state.BooksInfo.likeds){
                        if(state.BooksInfo.users[user].id == state.BooksInfo.likeds[likeds].userID){
                            for(books in state.BookCollection){
                                if(state.BooksInfo.likeds[likeds].id == state.BookCollection[books].id){
                                    for(category in state.BookCollection[books].categories){
                                        if (state.BookCollection[books].categories[category] == data.category){
                                            if (userHasBook == 0) {
                                                fb.usersCollection.doc(state.BooksInfo.users[user].id).collection("notifications").add({
                                                    message: `This book may interest you: ${data.title}`,
                                                    href: `/book/${data.bookID}`,
                                                }).catch(function(error){swal.fire({ title: 'Error!', text: error, icon: 'error', confirmButtonText: 'Ok'})})
                                                userHasBook++
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if(data.state == 'del'){
                fb.usersCollection.doc(auth.currentUser.uid).collection('notifications').doc(data.notificationID).delete()
                    // .then(function() {swal.fire({ position: 'top-end', icon: 'success', title: `The notification has been deleted succesfully!`, showConfirmButton: false, timer: 1500 }) })
            }
        },
        getBookData({state, dispatch}){
            booksCollection.where('isActive', '==', true).onSnapshot(snap=>{
                state.BookCollection = []
                state.BooksInfo.comments = []
                snap.forEach(test=> {
                    var data = test.data()
                    data.id = test.id
                    state.BookCollection.push(data)
                })
            })

            fb.usersCollection.onSnapshot(snap => {
                state.BooksInfo.users = []
                state.BooksInfo.likeds = []
                snap.forEach(user=> {
                    var userData = user.data()
                    userData.id = user.id
                    state.BooksInfo.users.push(userData)
                    fb.usersCollection.doc(userData.id).collection('likedBooks').onSnapshot(snap => {
                        snap.forEach(likedBook=> {
                            var likedData = likedBook.data()
                            likedData.id = likedBook.id
                            likedData.userID = userData.id
                            state.BooksInfo.likeds.push(likedData)
                        })
                    })
                })
            })
        },
        async Getuser({commit}){
            const userProfile = await fb.usersCollection.doc(auth.currentUser.uid).get()
            commit('setUserProfile', userProfile.data())

            return this.state.userProfile
        },
        async getAuthUser({state}){
            state.userUID = await auth.currentUser.uid
        },
    }
})