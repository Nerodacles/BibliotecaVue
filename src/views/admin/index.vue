<template>
    <div>
        TesT
        <div>
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
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2'
import { db } from '../../firebase'
import { auth } from '../../firebase'
import { storage } from '../../firebase'

export default {
    created(){
        db.collection("users").doc(auth.currentUser.uid).onSnapshot(snap=> {this.user = snap.data()});
        db.collection("default").onSnapshot(snap=> {
            this.defaultValues = [],
            snap.forEach(user=> {
            var client = user.data();
            client.id = user.id;
            this.defaultValues.push(client);
            });
        });
        db.collection("users").onSnapshot(snap=> {
            this.database = [],
            snap.forEach(user=> {
            var client = user.data();
            client.id = user.id;
            this.database.push(client);
            });
        });
    },
    data:() => ({
        database: [],
        defaultValues: [],
        user: [],
        categories: [],
		show: true,
        picture: null,
        uploadValue: 0,
        images: [],
        pdf: null,
    }),
    methods:{
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
            this.UploadAll()
        },
        UploadAll(){
            // const storageRef=storage.ref(`books/covers/${this.images[0].name}`).put(this.images[0]);
            // storageRef.on(`state_changed`,snapshot=>{ this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100 }, error=>{console.log(error.message)},
            // () => {
            //     this.uploadValue=100;
            //     storageRef.snapshot.ref.getDownloadURL().then((url)=>{
            //         Swal.fire({
            //         position: 'top-end',
            //         icon: 'success',
            //         title: url,
            //         showConfirmButton: false,
            //         timer: 1500
            //     })
            //     });
            // });
        },
    }
}
</script>

<style>
@import '~@sweetalert2/themes/dark/dark.css';

</style>