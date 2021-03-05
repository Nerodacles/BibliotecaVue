<template>
    <div>
        <sidebar></sidebar>
        <div class="content">
            <b-form @submit="onSubmit" @reset="onReset" v-if="show">
                <b-form-group label="Cover:" label-for="Bookname">
                    
                </b-form-group>
                <b-form-group label="Book Name:" label-for="Bookname">
                    <b-form-input v-model="newBook.BookName" type="text" placeholder="Book Name" required></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-2" label="ISBN:" label-for="isbn">
                    <b-form-input type="number" v-model="newBook.ISBN" placeholder="ISBN" required></b-form-input>
                </b-form-group>
                <b-form-group label="Categories:" label-for="input-3">
					<v-select taggable multiple push-tags :options="categories" v-model="newBook.categories" class="small" placeholder="select one or more"></v-select>
				</b-form-group>
				<b-button type="submit" class="mx-1" variant="primary">Submit</b-button>
				<b-button type="reset" class="mx-1" variant="danger">Reset</b-button>
			</b-form>
        </div>
    </div>
</template>

<script>
import Sidebar from '../../components/Sidebar'
import { booksCollection } from '../../firebase'
import { storage } from '../../firebase'
import { db } from '../../firebase'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';

export default {
	components: { Sidebar, vSelect },
	created() {
		db.collection("default").doc("categories").onSnapshot(snap=> {this.categories = snap.data().name})
	},
	data: () =>  ({
		newBook: {
			BookName: '',
			ISBN: '',
			categories: null
		},
		cover: null,
		categories: [],
		show: true
		}),
	methods: {
		onSubmit(event) {
			event.preventDefault()
			this.$store.dispatch('newBook',{
				covers: this.cover,
                name: this.newBook.BookName,
                ISBN: this.newBook.ISBN,
				category: this.newBook.categories,
            })
		},
		onReset(event) {
			event.preventDefault()
			this.newBook.BookName = ''
			this.newBook.ISBN = ''
			this.newBook.categories = []
			this.show = false
			this.$nextTick(() => {
				this.show = true
			})
		},
	}
}
</script>

<style scoped>
    .content {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 25px;
        height: 100%;
        width: 100%;
        font-size: 20px;
        font-weight: 20;
    }
</style>