<template>
    <div>
        <sidebar></sidebar>
        <div class="" :class="this.$route.params.test ? '' : 'container'">
            <div class="content">
                Libros
            </div>
                <button @click="GetAllBooks">hola</button>
                <p>{{AllBooks}}</p>
            <div>
                <nuxt-link :to="'/book/' + book.id" v-for="book in this.AllBooks" :key="book.BookName" class="">
                    <p>Book Name: {{book.BookName}}</p>
                    <img :src="book.covers" alt="test">
                    <p>Categories: {{ book.Categories[0] }}</p>
                </nuxt-link>
            </div>

            
        </div>
    </div>
</template>

<script>
import Sidebar from '../../components/Sidebar'
import { booksCollection } from '../../firebase'
import { storage } from '../../firebase'
import { db } from '../../firebase'

export default {
	components: { Sidebar },
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
        caption : '',
        img1: '',
        imageData: null
    }),
    methods: {
        async GetAllBooks(){
            booksCollection.onSnapshot(snap=> {
                snap.forEach(book=> {
                var bookData = book.data();
                bookData.id = book.id;
                this.AllBooks.push(bookData);
                });
            })
        },
        
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