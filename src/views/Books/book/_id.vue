<template>
    <div class="">
        <div class="text-white">
            <div class="hero bg-gray-600" :style="`background:url(${book.coverUrl}); background-size:cover`">
                <div class="container d-flex justify-content-center flex-col md:flex-row align-items-end pb-4" style="height:200px">
                    <div class="d-flex">
                        <h1 class="font-heading">{{ book.title }}</h1>
                        <!-- <div v-if="book.author">{{ book.author }}</div> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="container mx-auto mt-2 flex flex-col md:flex-row ">
            <div class="row">
                <div class="col-3">
                    <div>
                        <a :href="`${book.bookUrl}`"><img src="../../../assets/pdf.png" style="width:100px" alt="pdf"></a>
                        
                    </div>
                    <h4>Aqui Iria el Boton de Fav</h4>
                </div>
                <div class="col-8">
                    {{book.description}}
                </div>
            </div>
        </div>
        <!-- <p v-for="b in book.Categories" :key="b">
            {{b}}
        </p>
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