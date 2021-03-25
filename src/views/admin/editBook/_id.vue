<template>
    <div class="mx-5">
        <div class="content">Edit Books</div>
        <b-form @submit="onSubmit" @reset="onCancel" v-if="show && !loading" class="m-4 p-3">
            <b-form-group label="Book Name:" label-for="Bookname">
                <b-form-input v-model="book.title" type="text" placeholder="book name" required></b-form-input>
            </b-form-group>
            <b-form-group label="Author:" label-for="Author">
                <b-form-input v-model="book.author" type="text" placeholder="author" required></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-2" label="ISBN:" label-for="isbn">
                <b-form-input type="number" v-model="book.ISBN" placeholder="ISBN" required></b-form-input>
            </b-form-group>
            <b-form-group label="Categories:" label-for="input-3">
                <v-select taggable multiple push-tags :options="categories" v-model="book.categories" placeholder="select one or more"></v-select>
            </b-form-group>
            <b-form-group>
                <div class="form-group">
                    <label for="exampleFormControlTextarea1">Enter the Description</label>
                    <textarea class="form-control" v-model="book.description" rows="10"></textarea>
                </div>
            </b-form-group>
            <b-button type="submit" class="mx-1" variant="primary">Submit</b-button>
            <b-button type="reset" class="mx-1" variant="danger">Cancel</b-button>
        </b-form>
    </div>
</template>

<script>
import { booksCollection } from '../../../firebase'
import { db } from '../../../firebase'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';

export default {
    components: { vSelect },
    data: () => ({
		categories: [],
		show: true,
        book: null,
        loading: true,
    }),
    created(){
        db.collection("default").doc("categories").onSnapshot(snap=> {this.categories = snap.data().name})
        booksCollection.doc(this.$attrs.id).onSnapshot(snap=> {this.book = snap.data(),this.loading = false})
    },
    methods: {
        async onSubmit(event) {
			event.preventDefault()
            this.$store.dispatch('editBook',{bk: this.book, id: this.$attrs.id})
		},
		onCancel() {
			this.$router.push('/admin/AdminBooks')
		},
    }
}
</script>

<style scoped>
    .imagePreviewWrapper {
        width: 200px;
        height: 200px;
        display: block;
        margin: 0 auto 30px;
        background-size: cover;
        background-position: center center;
    }
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