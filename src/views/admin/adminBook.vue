
<template>
    <div>
        <div class="content">Administrate Books</div>
        <div class="panel-body px-4 pt-4">
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
                        <td v-if="book.user == userUID || userUID == 'sMRFpB1X1tMWFWfpcddok0K5Qav1' "><a v-bind:href="book.url">{{book.title}}</a></td>
                        <td v-if="book.user == userUID || userUID == 'sMRFpB1X1tMWFWfpcddok0K5Qav1' ">{{book.author}}</td>
                        <td v-if="book.user == userUID || userUID == 'sMRFpB1X1tMWFWfpcddok0K5Qav1' "><span class="far fa-trash-alt px-1" aria-hidden="true" v-on:click="removeBook(book)"></span><span class="fas fa-edit" aria-hidden="true" v-on:click="$router.push('/admin/editBook/'+book.id)"></span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { booksCollection } from '../../firebase'

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
            this.$store.dispatch('deleteBook',{
                id: book
            })
        },
    },
}
</script>

<style lang="css" scoped>
    .content {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        font-size: 50px;
        color: rgb(46, 46, 46);
        font-weight: 600;
    }
</style>