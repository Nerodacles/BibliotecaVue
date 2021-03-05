<template>
    <div>
        <div>
            <img :src="userData.photoURL" alt="">
        </div>
    </div>
</template>

<script>
import {auth} from '../../firebase'
import Swal from 'sweetalert2'

export default {
    computed: {
        userData(){
            Swal.fire({
                    title: 'Error!',
                    text: 'Do you want to continue',
                    icon: 'error',
                    confirmButtonText: 'Cool'
                })
            return auth.currentUser
        },
    },
    created() {
    },
    data:() => ({
        loggedIn: false,
    }),
    methods: {
        updateUser(){
            auth.currentUser.updateProfile({
                displayName: "Juanma Canahuate",
            }).then(function(d) {

            }).catch(function(error) {
                
            });
        },
        profile(){
            this.$store.dispatch('Getuser')
        },
    }
}
</script>

<style lang="scss" scoped>

</style>