<template>
    <div>
        <sidebar></sidebar>
        <p>Welcome {{fetchUser.name}}</p>
        <!-- <p>You're from: {{fetchUser.title.init}}</p> -->
        <p>User Email: {{email}}</p>
        <p>You're Admin: {{fetchUser.isAdmin}}</p>
    </div>
</template>

<script>
import { auth } from '../../firebase'

export default {
    computed: {
        fetchUser(){
			return this.$store.state.userProfile
		},
    },
    created(){
    },
    data:() => ({
        email: auth.currentUser.email
    }),
    methods: {
    },
}
</script>