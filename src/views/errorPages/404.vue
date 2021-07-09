<template>
    <div>

    </div>
</template>

<script>
import Swal from 'sweetalert2'
import router from '../../router'

    export default {
        computed: {
            pageRedirect(){
                return this.$router
            },
        },
        created() {
            Swal.fire({ icon: 'error', title: 'Page Not Found!', confirmButtonText: 'Go Back', timer: 10000 })
                .then(function() { router.push('/') })
    },
        metaInfo() { return { title: "404 - Page not found"} },
    }
</script>

<style lang="scss" scoped>

</style>