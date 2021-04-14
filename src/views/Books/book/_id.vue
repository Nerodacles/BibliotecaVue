<template>
    <div class="" v-if="book">
        <div class="text-white">
            <div class="hero bg-gray-600" :style="`background:url(${book.coverUrl}); background-size:cover`">
                <div class="container d-flex justify-content-center flex-col md:flex-row align-items-end pb-4" style="height:200px">
                    <div class="d-flex">
                        <!-- <h1 class="font-heading">{{ book.title }}</h1> -->
                        <!-- <div v-if="book.author">{{ book.author }}</div> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="container mx-auto mt-2 flex flex-col md:flex-row ">
            <div class="row">
                <div class="col-4">
                    <div>
                        <img :src="book.coverUrl" id="imagen" style="width:200px" alt="pdf">
                    </div>
                    <h6 class="font-weight-bold">ISBN:  <span class="font-weight-normal">{{book.ISBN}}</span> </h6> 
                    <h6 class="font-weight-bold">Categories:  <span class="font-weight-normal" v-for="category in book.categories" :key="category.id">{{category}}, </span> </h6>
                    <h6 class="font-weight-bold">Author:  <span class="font-weight-normal">{{book.author}}</span></h6> 
                    <div class="mt-3 row justify-content-center">
                        <div v-if="likedBook || likedBook == undefined">
                        <button class="btn" @click="likedState">
                            <span v-if="!likedBook" title="Like" class="like far fa-heart"></span>
                            <span v-if="likedBook" title="Dislike" class="like fas fa-heart"></span>
                        </button>
                        </div>
                        <div>
                            <a class="btn" :href="`${book.bookUrl}`">
                                <span class="like fas fa-file-pdf"></span>
                            </a>
                        </div>
                    </div>
                    
                </div>
                <div class="col-8">
                    <div>
                        <h2 class="font-weight-bold">{{ book.title }}</h2>
                        <br>
                    </div>
                    <div>
                        <h4 class="font-weight-bold">Description</h4>
                        <div class="pre-formatted">
                            {{ book.description }}
                        </div>
                    </div>
                    <br>
                    <comments></comments>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { auth, booksCollection, usersCollection } from '../../../firebase'
import comments from '../comments.vue';

export default {
    components: { 'comments': comments },
    computed: {
        userData(){
            return this.$store.state.userProfile
        },
    },
    data: () => ({
        book: null,
        likedBook: null,
    }),
    created(){
        booksCollection.doc(this.$attrs.id).onSnapshot(snap=> {this.book = snap.data()});
        usersCollection.doc(auth.currentUser.uid).collection('likedBooks').doc(this.$attrs.id).onSnapshot(snap=> {this.likedBook = snap.data()});
    },
    methods: {
        likedState(){
            this.$store.dispatch('likedState',{bookID: this.$attrs.id, liked: this.likedBook})
        },
    },
    metaInfo() {
        return {
            title: `Book: ${this.book?.title}`
        }
    },
}
</script>

<style lang="scss" scoped>
    .pre-formatted {
        text-align: justify;
        white-space: pre-line;
    }

    #imagen{
        margin-top: -65px;
        margin-bottom: 20px;
    }

    .like{
        font-size: 40px;
    }

</style>