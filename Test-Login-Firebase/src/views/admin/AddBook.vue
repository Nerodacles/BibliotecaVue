<template>
    <div>
        <sidebar></sidebar>
        <div class="content">
            <b-form @submit="onSubmit" @reset="onReset" v-if="show">
                <b-form-group id="input-group-1" label="Nombre del Libro:" label-for="Bookname">
                    <b-form-input id="bookname" type="email" placeholder="Ingrese el nombre del libro" required></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-2" label="ISBN:" label-for="isbn">
                    <b-form-input id="isbn" type="text" placeholder="Ingrese el ISBN" required></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-3" label="Categoria" label-for="input-3">
                    <b-form-select id="input-3" :options="categories" required></b-form-select>
                </b-form-group>


      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
        </div>
    </div>
</template>

<script>
import Sidebar from '../../components/Sidebar'
export default {
	components: { Sidebar },
    data() {
      return {
        form: {
          email: '',
          name: '',
          food: null,
          checked: []
        },
        categories: [{ text: 'Select One', value: null }, 'Ciencia Ficcion', 'Informatica', 'Historia'],
        show: true
      }
    },
    methods: {
      onSubmit(event) {
        event.preventDefault()
        alert(JSON.stringify(this.form))
      },
      onReset(event) {
        event.preventDefault()
        // Reset our form values
        this.form.email = ''
        this.form.name = ''
        this.form.food = null
        this.form.checked = []
        // Trick to reset/clear native browser form validation state
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      }
    }
}
</script>

<style scoped>
    .content {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 25px;
        height: 100%;
        width: 100%;
        font-size: 20px;
        font-weight: 20;
    }
</style>