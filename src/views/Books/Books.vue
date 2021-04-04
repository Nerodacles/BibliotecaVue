<template>
    <div class="">
        <div class="">
            <div class="container">
                <div class="content">Libros</div>
                <div class="row">
                    <div v-for="book in this.AllBooks" :key="book.id">
                        <router-link :to="'/book/' + book.id" class="col-sm-6 col-md-6 col-xl-2 col-xxl-3" v-if="book.isActive">
                            <div class="card m-2" style="width: 10rem;">
                                <img class="card-img-top" :src="book.coverUrl" alt="Card image cap">
                                <div class="card-body">
                                    <h5 class="card-title text-nero">{{book.title}}</h5>
                                    <h6 class="card-subtitle mb-2 texto text-muted">{{ book.author}}</h6>
                                    <h6 class="card-subtitle mb-2 texto text-muted">{{ book.categories[0] }}</h6>
                                </div>
                            </div>
                        </router-link>
                    </div>
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
        font-size: 40px;
        color: rgb(46, 46, 46);
        font-weight: 600;
        margin-top: 10px;
    }
    .card-img-top {
        height: 150px;
        width: 158px;
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

    a{
        width: 12rem;
        padding: 0;
        margin: 0;
    }
</style>