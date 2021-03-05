<template>
    <div id="app">
        <top-header></top-header>
        <router-view/>
    </div>
</template>

<script rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons"></script>

<script>
import TopHeader from "./components/Top-Header"

export default {
    components: {'top-header': TopHeader}
}
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background-color: #fff;
    min-height: 100vh;
}

#nav {
    padding: 30px;
    a {
        font-weight: bold;
        color: #134074;
        &.router-link-exact-active {
            color: #8DA9C4;
        }
    }
}
</style>
