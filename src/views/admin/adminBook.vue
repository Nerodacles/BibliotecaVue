
<template>
    <div>
        <div class="content">Administrate Books</div>
        <div>
            <b-table striped hover :items="AllBooks" :fields="fields" bordered borderless outlined dark head-variant="dark" table-variant="secondary" >
                <template #cell(title)="data">
                    <a :href="'/book/'+data.item.id" class="text-light">{{data.value}}</a>
                </template>
                <template #cell(actions)="data">
                    <button class="far fa-trash-alt btn btn-dark" v-on:click="removeBook(data.item)"></button>
                    <span class="px-1"></span>
                    <button class="fas fa-edit btn btn-dark" v-on:click="$router.push('/admin/editBook/'+ data.item.id)"></button>
                </template>
            </b-table>
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
        fields: [
            {key:'title', sortable: true},
            {key: 'author', sortable: true},
            {key:'actions'},
            {key: 'isActive', label: 'Is Active', formatter: (value, key, item) => { return value ? 'Yes' : 'No' }, sortable: true, sortByFormatted: true, filterByFormatted: true },
        ]
    }),
    methods: {
        removeBook: function (book) {
            this.$store.dispatch('bookActions',{
                action: 'delete',
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