<template>
    <div id="app">
        <top-header></top-header>
        <div v-if="userData.isActive">
            <sidebarAdmin v-if="userData.isAdmin"></sidebarAdmin>
            <sidebarUser v-if="!userData.isAdmin"></sidebarUser>
        </div>
        <div v-if="!userData.isActive" class="mt-4">
            <router-view />
        </div>
    </div>
</template>

<script rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons"></script>

<script>
import TopHeader from "./components/Top-Header"
import sidebarUser from "./components/Sidebar/user/user.vue"
import sidebarAdmin from "./components/Sidebar/admin/admin.vue"
import { auth, isPWA, analytics } from "./firebase"
import { version } from "../package.json"

export default {
    components: {'top-header': TopHeader, 'sidebarAdmin': sidebarAdmin, 'sidebarUser': sidebarUser},
    computed: {
        userData(){
            return this.$store.state.userProfile
        },
    },
    metaInfo: {
        changed(metaInfo) {
            analytics.setCurrentScreen(metaInfo.title)
            analytics.logEvent("page_view")
            analytics.logEvent("screen_view", {
                app_name: isPWA() ? "pwa" : "web",
                screen_name: metaInfo.title,
                app_version: version
            })
        }
    },
    mounted() {
        auth.onAuthStateChanged(user => {
            if (user) {
                analytics.setUserId(user.uid)
                if (this.userData?.isAdmin == true){
                    analytics.setUserProperties({
                        account_type: "Admin"
                    })
                }
                if (this.userData?.isAdmin == false){
                    analytics.setUserProperties({
                        account_type: "Basic"
                    })
                }
            }
        })
    },
    metaInfo() {
        return {
            title: `Virtual Library`
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
}
</style>

<style lang="sass">
@import '~@sweetalert2/theme-dark/dark.css';
</style>