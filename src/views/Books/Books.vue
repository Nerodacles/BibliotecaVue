<template>
    <div class="">
        <div class="">
            <div class="container">
                <h5 class="content">Libros</h5>
                <h6 id="search" class="font-weight-bold">Search Book</h6> 
                <div class="row my-2 justify-content-center">
                    <select v-model="Filtrar" class="col-md-2 mx-2" placeholder="Select one...">
                        <option disabled value="">Select one...</option>
                        <option value="title">Title</option>
                        <option value="category">Category</option>
                        <option value="author">Author</option>
                    </select>
                    <input class="col-md-5 col-sm-5" type="text" v-model="search" placeholder="Search Books Title">
                </div>
                <div class="row justify-content-center">
                    <div v-for="book in BooksPagination" :key="book.id" class="justify-content-end">
                        <router-link :to="'/book/' + book.id" class="col-sm-6 col-md-4 col-xl-3 col-xxl-3" v-if="book.isActive">
                            <div class="card m-2" style="width: 9rem;">
                                <img class="card-img-top" :src="book.coverUrl" :alt="book.title">
                                <div class="card-body">
                                    <h5 class="card-title text-nero">{{book.title}}</h5>
                                    <h6 class="card-subtitle mb-2 texto text-muted">{{book.author}}</h6>
                                    <h6 class="card-subtitle mb-2 texto text-muted">{{ book.categories[0] }}</h6>
                                </div>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-footer pb-0 pt-3">
            <pagination :pageSize=14 :items="filteredBooks" @changePage="onChangePage"></pagination>
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
                var bookData = book.data()
                bookData.id = book.id
                this.AllBooks.push(bookData)
            })
        })
	},

    data:() => ({
        Filtrar: '',
        AllBooks: [],
        BooksPagination: [],
        search: ''
    }),
    computed:{
        filteredBooks(){
            return this.AllBooks.filter((book) => {
                if(this.Filtrar == 'title' || this.Filtrar == ''){
                    return book.title.match(this.search)
                }
                if(this.Filtrar == 'category'){
                    return book.categories[0].match(this.search)
                }
                if(this.Filtrar == 'author'){
                    return book.author.match(this.search)
                }
            })
        }
    },
    methods: {
        onChangePage(BooksPagination) {
            // update page of items
            this.BooksPagination = BooksPagination;
        },
        // busquedaDePaginas(){
        //     // if (this.keyword == null) return
        //     // if (this.keyword != null){
        //     //     booksCollection.where('title', '>=', this.keyword).onSnapshot(snap=>{
        //     //         this.AllBooks = []
        //     //         snap.forEach(test=> {
        //     //             var data = test.data()
        //     //             data.id = test.id
        //     //             this.AllBooks.push(data)
        //     //         })
        //     //     })
        //     // }
        // },
    },
    metaInfo() {
        return {
            title: "Books"
        }
    },
    // watch: {
    //     keyword(newKeyword, oldKeyword){ this.busquedaDePaginas() },
    // }
}
</script>

<style scoped>
    .content {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        font-size: 40px;
        color: rgb(46, 46, 46);
        font-weight: 600;
        margin-top: 10px;
    }
    .card-img-top {
        height: 100px;
        width: 142px;
        object-fit: cover;
    }
    .text-nero {
        color: black;
        font-size: 18px;
        height: 24px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
    }
    .texto{
        overflow: hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
    }
    .icon{
        width: 10px;
        height: 10px;
        margin: 5px;
    }
    #search{
        margin-bottom: 0;
    }
</style>