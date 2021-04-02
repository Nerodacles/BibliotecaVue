<template>
    <div class="">
        <div class="text-white">
            <div class="hero bg-gray-600" :style="`background:url(${book.coverUrl}); background-size:cover`">
                <div class="container d-flex justify-content-center flex-col md:flex-row align-items-end pb-4" style="height:200px">
                    <div class="d-flex">
                        <h1 class="font-heading">{{ book.title }}</h1>
                        <!-- <div v-if="book.author">{{ book.author }}</div> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="container mx-auto mt-2 flex flex-col md:flex-row ">
            <div class="row">
                <div class="col-4">
                    <div>
                        <a :href="`${book.bookUrl}`"><img :src="book.coverUrl" id="imagen" style="width:100px" alt="pdf"></a>
                    </div>
                    <h6 class="font-weight-bold">Isbn:  <span class="font-weight-normal">{{book.ISBN}}</span> </h6> 
                    <h6 class="font-weight-bold">Categories:  <span class="font-weight-normal">{{book.categories[0]}}</span> </h6>
                    <h6 class="font-weight-bold">Author:  <span class="font-weight-normal">{{book.author}}</span></h6> 
                    <div>
                        <span class="like far fa-heart"></span>
                        <span class="like fas fa-heart"></span>
                    </div>
                </div>
                <div class="col-8">
                    <div>
                        <h4>Description</h4>
                        {{book.description}}
                    </div>
                    <br>
                    <comments></comments>
                </div>
            </div>
        </div>
        <!-- <p v-for="b in book.Categories" :key="b">
            {{b}}
        </p>
        {{book.ISBN}}
        {{book.bookUrl}} -->
    </div>
</template>

<script>
import { booksCollection } from '../../../firebase'
import comments from '../comments.vue';

export default {
    components: { 'comments': comments },
    data: () => ({
        book: null
    }),
    created(){
        booksCollection.doc(this.$attrs.id).onSnapshot(snap=> {this.book = snap.data()});
    }
}
</script>

<style lang="scss" scoped>
    #imagen{
        margin-top: -45px;
        margin-bottom: 20px;
    }

    .like{
        font-size: 40px;
    }

</style>