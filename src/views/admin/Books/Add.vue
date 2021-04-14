<template>
    <div class="">
        <div class="content">Register Books</div>
        <b-form @submit="onSubmit" @reset="onReset" v-if="show" class="m-4 p-3">
            <div class="row">
                <div class="col-md-6">
                    <b-form-group label-size="lg" label="Upload Cover:" label-for="UploadImage">
                        <div class="custom-file">
                            <!-- <input multiple ref="fileInput" lang="en" accept="image/*" type="file" @input="pickFile" class="custom-file-input"> -->
                            <input type="file" accept="image/*" @change="uploadImage" class="custom-file-input"/>
                            <label class="custom-file-label" for="customFile">Select cover</label>
                            <div v-if="images" class="container">
                                <div v-for="(image, key) in images" :key="key" class="m-2">
                                    <img class="preview imagePreviewWrapper row" :ref="'image'"/>
                                        {{ image.name }}
                                </div>
                            </div>
                        </div>
                    </b-form-group>
                </div>
                <div class="col-md-6">
                    <b-form-group label-size="lg" label="Upload Book:" label-for="UploadBookFile">
                        <div class="custom-file">
                            <!-- <input multiple ref="fileInput" lang="en" accept="image/*" type="file" @input="pickFile" class="custom-file-input"> -->
                            <input type="file" accept="application/pdf" @change="uploadBook" class="custom-file-input"/>
                            <label class="custom-file-label" for="customFile">Select pdf</label>
                            <div v-if="pdf" class="">
                                <div v-for="(pdf, key) in pdf" :key="key" class="">
                                    <div class="">
                                        <img class="preview mt-2" src="@/assets/pdf.png" width="40" height="40"/>
                                            {{ pdf.name }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </b-form-group>
                </div>
            </div>
            <div class="row">
                <div class="col-md-8">
                    <b-form-group label-size="lg" label="Book Name:">
                        <b-form-input v-model="newBook.BookName" type="text" placeholder="Book name" required></b-form-input>
                    </b-form-group>
                </div>
                <div class="col-md-4">
                    <b-form-group label-size="lg" label="ISBN:">
                        <b-form-input type="number" v-model="newBook.ISBN" placeholder="ISBN" required></b-form-input>
                    </b-form-group>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <b-form-group label-size="lg" label="Author:">
                        <b-form-input v-model="newBook.Author" type="text" placeholder="Author" required></b-form-input>
                    </b-form-group>
                </div>
                <div class="col-md-6">
                    <b-form-group label-size="lg" label="Categories:">
                        <v-select taggable multiple push-tags :options="categories" v-model="newBook.categories" class="style-choooser" placeholder="Select one or more"></v-select>
                    </b-form-group>
                </div>
            </div>
            <b-form-group label-size="lg" label="Sinopsis:">
                <textarea class="form-control" v-model="newBook.Description" rows="10"></textarea>
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
</template>

<script>
import { storage } from '../../../firebase'
import { db } from '../../../firebase'
import { auth } from '../../../firebase'
import swal from 'sweetalert2'
import vSelect from 'vue-select'

export default {
	components: { vSelect },
	created() {
		db.collection("default").doc("categories").onSnapshot(snap=> {this.categories = snap.data().name})
        this.$store.dispatch('getBookData')
	},
	data: () =>  ({
		newBook: {
			BookName: '',
			Author: '',
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
		async onSubmit(event) {
			event.preventDefault()
            this.picture=null;
            this.uploadValue = 0;
            this.getUrl()
		},
		onReset(event) {
			event.preventDefault()
			this.newBook.BookName = ''
			this.newBook.Author = ''
			this.newBook.ISBN = ''
			this.newBook.Description = ''
			this.newBook.pdf = null
			this.pdf = null
			this.newBook.categories = []
			this.show = false
            this.uploadValue = 0
            this.images = []
			this.$nextTick(() => {
				this.show = true
			})
		},
        selectImage () {
            this.$refs.fileInput.click()
        },
        uploadImage(e) {
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
            const storageRef=  storage.ref(`/books/${this.newBook.BookName}/${this.pdf[0].name}`).put(this.pdf[0]);
            storageRef.on(`state_changed`,snapshot=>{ this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100 }, error=>{
                swal.fire({ position: 'top-end', icon: 'error', title: error, showConfirmButton: false, timer: 1500  })},
            () => {
                storageRef.snapshot.ref.getDownloadURL().then((url)=>{
                    this.newBook.pdf = url
                    this.UploadAll()
                });
            });
        },
        UploadAll(){
            const storageRef=  storage.ref(`/books/${this.newBook.BookName}/${this.images[0].name}`).put(this.images[0]);
            storageRef.on(`state_changed`,snapshot=>{ this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100 }, error=>{
                swal.fire({ position: 'top-end', icon: 'error', title: error, showConfirmButton: false, timer: 1500 })},
            () => {
                this.uploadValue=100;
                storageRef.snapshot.ref.getDownloadURL().then((url)=>{
                    this.$store.dispatch('bookActions',{
                        action: 'create',
                        covers: url,
                        file: this.newBook.pdf,
                        name: this.newBook.BookName,
                        author: this.newBook.Author,
                        ISBN: this.newBook.ISBN,
                        category: this.newBook.categories,
                        description: this.newBook.Description,
                        user: auth.currentUser.uid
                    })
                })
            })
        },
    },
    metaInfo() {
        return {
            title: "Add Books",
        }
    },
}
</script>

<style>
    .style-choooser .vs__dropdown-toggle {
    background: #fff;
    border: 1px solid #ced4da;
    background-clip: padding-box;
    padding: 2px;
    border-radius: 0.25rem;
  }
    .style-choooser .vs__search::placeholder{
        color: #495057;
    }
    

  .style-choooser .vs__clear,
  .style-choooser .vs__open-indicator {
    fill: #394066;
  }
    .imagePreviewWrapper {
        width: 100px;
        height: 100px;
        display: block;
        margin: 0 auto 10px;
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