<template>
    <div id="app">
        <top-header></top-header>
        <sidebar></sidebar>
    </div>
</template>

<script rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons"></script>

<script>
import TopHeader from "./components/Top-Header"
import sidebar from "./components/Sidebar"

export default {
    components: {'top-header': TopHeader, 'sidebar': sidebar}
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

</style>
