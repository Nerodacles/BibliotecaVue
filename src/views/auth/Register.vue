<template>
    <div>
		<div class="">
			<div class="login-form">
				<form @submit.prevent="signup">
					<h2 class="text-center display-4 text-bluewhite">Register</h2>
					<div class="form-group has-error">
						<input type="email" class="form-control" v-model="email" autocomplete="email" placeholder="Email" required>
						<input type="password" class="form-control" v-model="password" minlength="6" autocomplete="new-password" placeholder="Password" required/>
					</div>
					<div class="form-group">
                        <input v-model.trim="name" class="form-control" type="text" autocomplete="name" placeholder="Name" required/>
                        <v-select :options="universities" label="init" v-model="uni" class="" placeholder="Select an University"></v-select>
                    </div>
					<div class="form-group">
						<button type="submit" class="btn btn-primary btn-lg btn-block"> Submit </button>
					</div>
				</form>
                <p class="text-center small text-bluewhite"> Already have an account? <router-link to="/login" class="text-darkblue">Login here!</router-link></p>
			</div>
		</div>
	</div>
</template>

<script>
import { db } from '../../firebase'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';

export default {
    components: { vSelect },
    created() {
		db.collection("default").doc("Uni").onSnapshot(snap=> {this.universities = snap.data().unis})
	},
    methods: {
        signup() {
            this.$store.dispatch('signup', {
                email: this.email,
                password: this.password,
                name: this.name,
                uni: this.uni,
            })
        },
    },
    data:() => ({
        email: '',
        password: '',
        name: '',
        uni: '',
        universities: []
    }),
    metaInfo() {
        return {
            title: "Register",
        }
    },
}
</script>

<style>
.text-bluewhite {
	color: rgb(28, 91, 163);
}
.form-control {
    min-height: 41px;
    background: #f2f2f2;
    box-shadow: none !important;
    border: transparent;
}
.form-control:focus {
    background: #ffffff;
}
.form-control,
.btn {
    border-radius: 2px;
}
.login-form {
    width: 350px;
    margin: 30px auto;
    text-align: center;
}
.login-form h2 {
    margin: 10px 0 25px;
}
.login-form form {
    color: #ffffff;
    border-radius: 3px;
    margin-bottom: 15px;
    background: #fff;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    padding: 30px;
}
.login-form .btn {
    font-size: 16px;
    font-weight: bold;
    background: #3598dc;
    border: none;
    outline: none !important;
}
.login-form .btn:hover,
.login-form .btn:focus {
    background: #2389cd;
}
.login-form a {
    color: rgb(51, 146, 255);
    text-decoration: underline;
}
.login-form a:hover {
    text-decoration: none;
}
.login-form form a {
    color: #7a7a7a;
    text-decoration: none;
}
.login-form form a:hover {
    text-decoration: underline;
}
</style>