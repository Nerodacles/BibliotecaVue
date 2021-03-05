<template>
    <div>
        <div v-if="!fetchData" class="d-flex" id="wrapper">
            <!-- Sidebar -->
            <div class="bg-light border-right" id="sidebar-wrapper">
            <br><br>
            <div class="list-group list-group-flush">
                <a href="/Books" class="list-group-item list-group-item-action bg-light" :class="this.$route.name == 'Books' ? 'active bg-dark' : ''">Books</a>
                <a href="/AddBook" class="list-group-item list-group-item-action bg-light" :class="this.$route.name == 'AddBook' ? 'active bg-dark' : 'inactive'">Add book</a>
                <a href="#" class="list-group-item list-group-item-action bg-light">Events</a>
                <a href="#" class="list-group-item list-group-item-action bg-light">Profile</a>
                <a href="#" class="list-group-item list-group-item-action bg-light">Status</a>
            </div>
            </div>
            <!-- /#sidebar-wrapper -->
        
        </div>
    </div>
</template>

<script>
export default {
	data: () =>  ({
    
	}),
    computed: {
        fetchData () {
            return this.$route.params.test
        },
    },
    watch:{
        // eslint-disable-next-line no-unused-vars
        fetchData(oldValue, NewValue){
            console.log(this.$route.params.test)
        }
    },
}
</script>

<style scoped>
 #wrapper {
    overflow-x: hidden;
 }

#sidebar-wrapper {
  min-height: 100vh;
  margin-left: -15rem;
  position: fixed;
  -webkit-transition: .25s ease-out;
  -moz-transition: .25s ease-out;
  -o-transition: .25s ease-out;
  transition: .25s ease-out;
}

#sidebar-wrapper .sidebar-heading {
  padding: 0.875rem 1.25rem;
  font-size: 1.2rem;
}

#sidebar-wrapper .list-group {
  width: 15rem;
}

#page-content-wrapper {
  min-width: 100vw;
}

#wrapper.toggled #sidebar-wrapper {
  margin-left: 0;
}

@media (min-width: 768px) {
  #sidebar-wrapper {
    margin-left: 0;
  }

  #page-content-wrapper {
    min-width: 0;
    width: 100%;
  }

  #wrapper.toggled #sidebar-wrapper {
    margin-left: -15rem;
  }
}
</style>