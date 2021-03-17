<template>
    <div class="">
        <div class="row">
            <div class="">
                <div class="content">
                    Libros
                </div>
                    <p>{{AllBooks}}</p>
                <div>
                    <router-link :to="'/book/' + book.id" v-for="book in this.AllBooks" :key="book.id" class="">
                        <p>Book Name: {{book.title}}</p>
                        <img :src="book.coverUrl">
                        <p>Author: {{ book.author }}</p>
                        <p>Categories: {{ book.categories[0] }}</p>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { booksCollection } from '../../firebase'
import { storage } from '../../firebase'
import { db } from '../../firebase'

export default {
    created() {
		booksCollection.onSnapshot(snap=> {
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
</style>