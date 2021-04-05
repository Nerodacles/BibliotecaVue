<template>
    <div class="">
        <div class="">
            <div class="container">
                <h5 class="content">Advanced Search</h5>
                <div class="row m-3 justify-content-center">
                    <select class="col-3 mx-2" name="search" id="">
                        <option value="" disabled selected>Filtrado por</option>
                        <option value="1">Titulo</option>
                        <option value="2">Autor</option>
                        <option value="3">Categoria</option>
                    </select>
                    <input type="text" class="col-5" name="" id="">
                </div>
                <div class="row m-3 justify-content-center">
                    <select class="col-3 mx-2" name="search" id="">
                        <option value="" disabled selected>Filtrado por</option>
                        <option value="1">Titulo</option>
                        <option value="2">Autor</option>
                        <option value="3">Categoria</option>
                    </select>
                    <input type="text" class="col-5" name="" id="">
                </div>
                <div class="row m-3 justify-content-center">
                    <select class="col-3 mx-2" name="search" id="">
                        <option value="" disabled selected>Filtrado por</option>
                        <option value="1">Titulo</option>
                        <option value="2">Autor</option>
                        <option value="3">Categoria</option>
                    </select>
                    <input type="text" class="col-5" name="" id="">
                </div>
                
            </div>
        </div>
        <!-- <div class="card-footer pb-0 pt-3">
            <pagination :pageSize=20 :items="AllBooks" @changePage="onChangePage"></pagination>
        </div> -->
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
        pageOfItems: []
    }),
    methods: {
        onChangePage(pageOfItems) {
            console.log(pageOfItems)
            // update page of items
            this.pageOfItems = pageOfItems;
        }
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