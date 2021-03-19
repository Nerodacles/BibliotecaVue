<template>
    <div>
		<div class="">
			<div class="alert alert-warning alert-dismissible fade show" role="alert" v-if="error">
				<span>{{error}}</span>
			</div>
			<div class="login-form">
				<form @submit.prevent="login">
					<h2 class="text-center display-4 text-bluewhite">Login</h2>
					<div class="form-group has-error">
						<input type="email" class="form-control" v-model="email" placeholder="Username" required="required"/>
					</div>
					<div class="form-group">
						<input type="password" class="form-control" v-model="password" placeholder="Password" required="required"/>
					</div>
					<div class="form-group">
						<button type="submit" class="btn btn-primary btn-lg btn-block"> Sign in </button>
					</div>
					<p><a href="#">Lost your Password?</a></p>
				</form>
				<p class="text-center small text-bluewhite"> Don't have an account? <router-link to="/register" class="text-darkblue">Sign up here!</router-link></p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
    data: () => ({
        email: "",
        password: "",
        error: ""
    }),
    methods: {
        login(){
            this.$store.dispatch('login',{
                email: this.email,
                password: this.password
            })
        }
    }
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