<template>
    <div>
        <sidebar></sidebar>
        <div class="content">
            <b-form @submit="onSubmit" @reset="onReset" v-if="show">
                <b-form-group label="Upload Cover:" label-for="UploadImage">
                    <div class="custom-file">
                        <!-- <input multiple ref="fileInput" lang="en" accept="image/*" type="file" @input="pickFile" class="custom-file-input"> -->
                        <input type="file" accept="image/*" @change="uploadImage" class="custom-file-input"/>
                        <label class="custom-file-label" for="customFile">select cover</label>
                        <div v-if="images" class="container">
                            <div v-for="(image, key) in images" :key="key" class="col-sm-3 col-md-4 col-lg-2">
                                <div class="">
                                    <img class="preview imagePreviewWrapper row" :ref="'image'"/>
                                        {{ image.name }}
                                </div>
                            </div>
                        </div>
                    </div>
                </b-form-group>
                <b-form-group label="Upload Book:" label-for="UploadBookFile">
                    <div class="custom-file">
                        <!-- <input multiple ref="fileInput" lang="en" accept="image/*" type="file" @input="pickFile" class="custom-file-input"> -->
                        <input type="file" accept="application/pdf" @change="uploadBook" class="custom-file-input"/>
                        <label class="custom-file-label" for="customFile">select pdf</label>
                        <div v-if="pdf" class="">
                            <div v-for="(pdf, key) in pdf" :key="key" class="">
                                <div class="">
                                    <img class="preview" src="@/assets/pdf.png" width="100" height="100"/>
                                        {{ pdf.name }}
                                </div>
                            </div>
                        </div>
                    </div>
                </b-form-group>
                <b-form-group label="Book Name:" label-for="Bookname">
                    <b-form-input v-model="newBook.BookName" type="text" placeholder="book name" required></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-2" label="ISBN:" label-for="isbn">
                    <b-form-input type="number" v-model="newBook.ISBN" placeholder="ISBN" required></b-form-input>
                </b-form-group>
                <b-form-group label="Categories:" label-for="input-3">
					<v-select taggable multiple push-tags :options="categories" v-model="newBook.categories" class="small" placeholder="select one or more"></v-select>
				</b-form-group>
                <b-form-group>
                    <div class="form-group">
                        <label for="exampleFormControlTextarea1">Enter the Description</label>
                        <textarea class="form-control" v-model="newBook.Description" rows="5"></textarea>
                    </div>
                </b-form-group>
                <div v-if="images[0] && pdf">
                    <p>Progress: {{uploadValue.toFixed()+"%"}}
                        <progress id="progress" :value="uploadValue" max="100"></progress>  
                    </p>
                </div>
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
			categories: null,
            Description: '',
            pdf: null,
		},
		categories: [],
		show: true,
        picture: null,
        uploadValue: 0,
        images: [],
        pdf: null,
		}),
	methods: {
		onSubmit(event) {
			event.preventDefault()
            this.picture=null;
            this.uploadValue = 0;
            this.getUrl()
            const storageRef=storage.ref(`${this.images[0].name}`).put(this.images[0]);
            storageRef.on(`state_changed`,snapshot=>{ this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100 }, error=>{console.log(error.message)},
            () => {
                this.uploadValue=100;
                storageRef.snapshot.ref.getDownloadURL().then((url)=>{
                    this.$store.dispatch('newBook',{
                        covers: url,
                        file: this.newBook.pdf,
                        name: this.newBook.BookName,
                        ISBN: this.newBook.ISBN,
                        category: this.newBook.categories,
                        description: this.newBook.Description
                    })
                });
            });
		},
		onReset(event) {
			event.preventDefault()
			this.newBook.BookName = ''
			this.newBook.ISBN = ''
			this.newBook.Description = ''
			this.newBook.pdf = ''
			this.newBook.categories = []
			this.show = false
            this.uploadValue=0;
            this.images = []
			this.$nextTick(() => {
				this.show = true
			})
		},
        selectImage () {
            this.$refs.fileInput.click()
        },
        uploadImage(e) {
            let vm = this;
            this.uploadValue=0;
            this.picture=null;
            var selectedFiles = e.target.files;
            // for (let i = 0; i < selectedFiles.length; i++) {
                // this.images.push(selectedFiles[0]);
                this.images = selectedFiles
            // }

            for (let i = 0; i < this.images.length; i++) {
                let reader = new FileReader();
                reader.onload = (e) => {
                    this.$refs.image[i].src = reader.result;
                };
                reader.readAsDataURL(this.images[i]);
            }
        },
        uploadBook(e){
            let vm = this
            var selectedFiles = e.target.files
            this.pdf = selectedFiles
        },
        getUrl(){
            const storageRef=storage.ref(`${this.pdf[0].name}`).put(this.pdf[0]);
            storageRef.on(`state_changed`,snapshot=>{ this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100; }, error=>{console.log(error.message)},
            () => {
                this.uploadValue=50;
                storageRef.snapshot.ref.getDownloadURL().then((url)=>{
                    this.newBook.pdf = url
                });
            });
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

    .imagePreviewWrapper {
        width: 200px;
        height: 200px;
        display: block;
        margin: 0 auto 30px;
        background-size: cover;
        background-position: center center;
    }
</style>