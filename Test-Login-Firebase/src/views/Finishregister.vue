<template>
    <div>
      <div class="">
			<div class="alert alert-warning alert-dismissible fade show" role="alert" v-if="error">
				<span>{{error}}</span>
			</div>
			<div class="login-form">
				<form @submit.prevent="submitUser">
					<h2 class="text-center display-4 text-bluewhite">Finish Register</h2>
					<div class="form-group has-error">
						<input type="text" class="form-control" v-model="nombre" placeholder="Nombre" required="required"/>
					</div>
					<div class="form-group">
						<input type="text" class="form-control" v-model="uni" placeholder="University" required="required"/>
					</div>
					<div class="form-group">
						<button type="submit" class="btn btn-primary btn-lg btn-block"> Submit </button>
					</div>
				</form>
			</div>
		</div>
    </div>
</template>

<script>
import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'

export default {
  data:() => ({
    nombre: '',
    uni: ''
  }),
  methods: {
    submitUser(){
      firebase.firestore().collection("roles").doc(firebase.auth().currentUser.uid)
      .set({
        name: this.nombre,
        uni: this.uni,
        email: firebase.auth().currentUser.email,
        createdAt: new Date(),
        isActive: true,
        isAdmin: false,
      });
      this.$router.replace( {name:"user"} )
    }
  }
}
</script>

<style lang="scss" scoped>

</style>