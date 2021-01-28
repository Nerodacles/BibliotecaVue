<template>
    <div>
        Login
        <form @submit.prevent="pressed">
            <div class="login">
                <input type="email" placeholder="Login">
                
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                email: '',
                password: '',
                error: ''
            }
        },
        methods: {
            pressed() {
                alert('hi')
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>