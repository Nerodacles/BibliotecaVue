<template>
    <div>
        <sidebar></sidebar>
        <div class="content">
            Libros
        </div>
    </div>
</template>

<script>
import Sidebar from '../../components/Sidebar'
export default {
	components: { Sidebar },
    
}
</script>

<style scoped>
    .content {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        font-size: 60px;
        color: rgb(167, 167, 167);
        font-weight: 600;
    }
</style>