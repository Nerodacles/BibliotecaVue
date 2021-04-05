<template>
    <div id="app">
        <top-header></top-header>
        <!-- <div v-if="nero"> -->
            <sidebarAdmin v-if="userData.isAdmin"></sidebarAdmin>
            <sidebarUser v-if="!userData.isAdmin"></sidebarUser>
        <!-- </div> -->
        <!-- <div v-if="!nero">
            <router-view />
        </div> -->
    </div>
</template>

<script rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons"></script>

<script>
import TopHeader from "./components/Top-Header"
import sidebarUser from "./components/Sidebar/user/user.vue"
import sidebarAdmin from "./components/Sidebar/admin/admin.vue"
import { auth } from "./firebase"

export default {
    components: {'top-header': TopHeader, 'sidebarAdmin': sidebarAdmin, 'sidebarUser': sidebarUser},
    data: ()=> ({
        nero: null
    }),
    computed: {
        userData(){
            return this.$store.state.userProfile
        },
    },
    created(){
        if(auth.currentUser){
            this.nero = true
        }else this.nero = false
    },
    watch: {
        '$route':{
            handler: (to, from) => {
                document.title = to.meta.title || 'Your Website'
            },
            immediate: true
        }
    },
}
</script>

<style lang="css">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background-color: #f0efef;
    min-height: 100vh;
}
</style>
