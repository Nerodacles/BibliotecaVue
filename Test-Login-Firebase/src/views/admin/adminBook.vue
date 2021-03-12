
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
                        <td><span class="glyphicon glyphicon-trash" aria-hidden="true" v-on:click="removeBook(book)"></span></td>
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

export default {
    created() {
        this.$toastr.i("Cuanto tu ames, eso es lo que vales");
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
}
</script>

<style lang="scss" scoped>

</style>