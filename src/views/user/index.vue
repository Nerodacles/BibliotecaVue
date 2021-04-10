<template>
    <div>
        <p>Welcome {{fetchUser.name}}</p>
        <!-- <p>You're from: {{fetchUser.title.init}}</p> -->
        <p>User Email: {{email}}</p>
        <p>You're Admin: {{fetchUser.isAdmin}}</p>
        <p>{{userUID}}</p>
    </div>
</template>

<script>
import Swal from 'sweetalert2'
import { auth } from '../../firebase'

export default {
    computed: {
        fetchUser(){
			return this.$store.state.userProfile
		},
    },
    created(){
        Swal.fire({})
    },
    data:() => ({
        email: auth.currentUser.email,
        userUID: auth.currentUser.uid
    }),
    methods: {
    },
    metaInfo() {
        return {
        title: "Profile",
        }
    },
}
</script>