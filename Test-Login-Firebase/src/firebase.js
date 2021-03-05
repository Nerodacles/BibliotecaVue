
import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

// firebase init - add your own config here
const firebaseConfig = {
    apiKey: "AIzaSyCQpj6yylxEBIN7tRRCYUGRKLKIbUaadVA",
    authDomain: "biblioteca-vue.firebaseapp.com",
    projectId: "biblioteca-vue",
    storageBucket: "biblioteca-vue.appspot.com",
    messagingSenderId: "445771738959",
    appId: "1:445771738959:web:aecd278bf0fbd89eed1f3a",
    measurementId: "G-GKPXCHB9JK"
};
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

// collection references
const usersCollection = db.collection('users')
const booksCollection = db.collection('books')
const commentsCollection = db.collection('comments')
const likesCollection = db.collection('likes')

// export utils/refs
export {
    db,
    auth,
    storage,
    usersCollection,
    booksCollection,
    commentsCollection,
    likesCollection 
}