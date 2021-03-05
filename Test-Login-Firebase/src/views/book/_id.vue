<template>
    <div class="">
        <div>
            
        </div>
        <div class="text-white">
            <div class="hero bg-gray-600" :style="`background:url(${book.coverUrl}); background-size:cover`">
                <div class="container mx-auto flex flex-col md:flex-row items-end pb-4" style="height:250px">
                    <div class="w-full md:w-1/4"></div>
                    <div class="w-full md:w-3/4 md:ml-12">
                        <h1 class="font-heading">{{ book.BookName }}</h1>
                        <div v-if="book.author">{{ book.author }}</div>
                    </div>
                </div>
            </div>
            <div class="container mx-auto flex flex-col md:flex-row ">
                <div class="w-full md:w-1/4 -mt-16">
                    <img :src="book.coverUrl" alt="cover" class="mb-8" v-if="!!book.coverUrl">
                </div>
            </div>
            <div>
                <div>
                    
                </div>
            </div>
        </div>
        <!-- <p v-for="b in book.Categories" :key="b">
            {{b}}
        </p>
        {{book.Description}}
        {{book.ISBN}}
        {{book.bookUrl}} -->
    </div>
</template>

<script>
import { booksCollection } from '../../firebase'

export default {
    data: () => ({
        book: null
    }),
    created(){
        booksCollection.doc(this.$attrs.id).onSnapshot(snap=> {this.book = snap.data()});
    }
}
</script>

<style lang="scss" scoped>

</style>