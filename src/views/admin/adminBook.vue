
<template>
    <div>
        <div class="panel-body pt-4">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="book in AllBooks" :key="book.id">
                        <td><a v-bind:href="book.url">{{book.title}}</a></td>
                        <td>{{book.author}}</td>
                        <td><span class="far fa-trash-alt px-1" aria-hidden="true" v-on:click="removeBook(book.id)" v-if="book.user == userUID"></span><span class="fas fa-edit" aria-hidden="true" v-on:click="$router.push('/admin/editBook/'+book.id)" v-if="book.user == userUID"></span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { booksCollection } from '../../firebase'
import { storage } from '../../firebase'
import { db } from '../../firebase'
import { auth } from '../../firebase'

export default {
    computed: {
        userUID(){
            return this.$store.state.userUID
        },
    },
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
        removeBook: function (book) {
            // booksCollection.doc(book).delete()
            this.$store.dispatch('deleteBook',{
                id: book
            })
        },
    },
}
</script>

<style lang="scss" scoped>

</style>