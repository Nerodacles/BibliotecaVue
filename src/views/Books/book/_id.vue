<template>
    <div class="">
        <div class="text-white">
            <div class="hero bg-gray-600" :style="`background:url(${book.coverUrl}); background-size:cover`">
                <div class="container d-flex justify-content-center flex-col md:flex-row align-items-end pb-4" style="height:200px">
                    <div class="d-flex">
                        <h1 class="font-heading">{{ book.title }}</h1>
                        <div v-if="book.author">{{ book.author }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container mx-auto mt-2 flex flex-col md:flex-row ">
            <div class="row">
                <div class="col-3">
                    <img src="../../../assets/pdf.png" id="prueba" style="width:100px" alt="">
                    <h4>Aqui Iria el Boton de Fav</h4>
                1 of 3
                </div>
                <div class="col-8">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                </div>
            </div>
        </div>
        <!-- <p v-for="b in book.Categories" :key="b">
            {{b}}
        </p>
        {{book.Description}}
        {{book.ISBN}}
        {{book.bookUrl}} -->
    </div>
</template>

<script>
import { booksCollection } from '../../../firebase'

export default {
    data: () => ({
        book: null
    }),
    created(){
        booksCollection.doc(this.$attrs.id).onSnapshot(snap=> {this.book = snap.data()});
    }
}
</script>

<style lang="scss" scoped>
    #prueba{
        margin-top: -45px;
    }
</style>