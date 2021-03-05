<template>
    <div class="container-fluid p-0">
        <div class="row">
            <sidebar class="col-sm-3 col-md-4 col-lg-2"></sidebar>
            <div class="" :class="this.$route.params.test ? '' : 'col-sm-9 col-md-8'">
                <div class="content">
                    Libros
                </div>
                    <p>{{AllBooks}}</p>
                <div>
                    <router-link :to="'/book/' + book.id" v-for="book in this.AllBooks" :key="book.id" class="">
                        <p>Book Name: {{book.BookName}}</p>
                        <img :src="book.coverUrl" alt="test">
                        <p>Categories: {{ book.Categories[0] }}</p>
                    </router-link>
                </div>
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