<template>
    <div>
        <div class="">
            <div class="container">
                <h5 class="content">Liked Books</h5>
                <div class="row justify-content-center">
                    <div v-for="book in LikedBooks" :key="book.id" class="justify-content-end">
                        <router-link :to="'/book/' + book.id" class="col-sm-6 col-md-4 col-xl-3 col-xxl-3" v-if="book.isActive">
                            <div class="card m-2" style="width: 9rem;">
                                <img class="card-img-top" :src="book.coverUrl" :alt="book.title">
                                <div class="card-body">
                                    <h5 class="card-title text-nero">{{book.title}}</h5>
                                    <h6 class="card-subtitle mb-2 texto text-muted">{{ book.author}}</h6>
                                    <h6 class="card-subtitle mb-2 texto text-muted">{{ book.categories[0] }}</h6>
                                </div>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { auth, db, booksCollection,usersCollection } from '../../../firebase'
import Swal from 'sweetalert2'

export default {
    computed: {
        userData(){
            return this.$store.state.userProfile
        },
        userUID(){
            return this.$store.state.userUID
        },
    },
    created() {
        db.collection(`/users/${this.userUID}/likedBooks/`).onSnapshot(snap=> {
            this.LikedBooks = []
            snap.forEach(liked=> {
                var bookData = liked.data()
                bookData.id = liked.id
                booksCollection.doc(bookData.id).onSnapshot(snap=> {let book = snap.data(); book.id = snap.id; this.LikedBooks.push(book) });
            })
        })
    },
    data:() => ({
        LikedBooks: [],
    }),
    methods: {

    },
    metaInfo() {
        return {
        title: "Profile",
        }
    },
}
</script>

<style scoped>
    .content {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        font-size: 40px;
        color: rgb(46, 46, 46);
        font-weight: 600;
        margin-top: 10px;
    }
    .card-img-top {
        height: 100px;
        width: 142px;
        object-fit: cover;
    }
    .text-nero {
        color: black;
        font-size: 18px;
        height: 24px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
    }
    .texto{
        overflow: hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
    }

</style>