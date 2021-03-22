<template>
    <div class="">
        <div class="">
            <div class="container">
                <div class="content">
                    Libros
                </div>
                <div class="row justify-content-center">
                    <router-link :to="'/book/' + book.id" v-for="book in this.AllBooks" :key="book.id" class="item col-sm-6 col-md-4 col-xl-3 col-xxl-3">
                        <div>
                            <p>{{book.title}}</p>
                            <img :src="book.coverUrl" class="img">
                            <p>{{ book.author }}</p>
                            <p>{{ book.categories[0] }}</p>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { booksCollection } from '../../firebase'

export default {
    created() {
		booksCollection.onSnapshot(snap=> {
            this.AllBooks = []
            snap.forEach(book=> {
                var bookData = book.data();
                bookData.id = book.id;
                this.AllBooks.push(bookData);
            });
        });
	},

    data:() => ({
        AllBooks: [],
    }),
    methods: {
        
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
        font-size: 60px;
        color: rgb(167, 167, 167);
        font-weight: 600;
    }
    .img {
        height: 100%;
        width: 100%;
    }
</style>