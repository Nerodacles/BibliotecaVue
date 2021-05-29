<template>
    <div class="container">
        <div class="row align-items-center justify-content-center mt-4">
            <div class="col-sm-6">
                <div class="card mt-5">
                    <div class="login-box">
                        <div class="login-snip"> <input id="tab-1" type="radio" name="tab" class="sign-in" checked><label for="tab-1" class="tab">Forgot Password!</label> <input id="tab-2" type="radio" name="tab" class="sign-up"><label class="tab"></label>
                            <div class="login-space">
                                <div class="login">
                                    <form @submit.prevent="RecoverPass">
                                        <div class="br"></div>
                                        <div class="group"> <label for="email" class="label">Email</label> <input id="email" v-model="email" autocomplete="current-email" type="email" class="input" placeholder="Enter your email"> </div>
                                        <div class="br"></div>
                                        <div class="group"> <input type="submit" class="button" value="Sign In"> </div>
                                        <div class="hr"></div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: () => ({
        email: "",
    }),
    methods: {
        RecoverPass(){
            this.$store.dispatch('recoverpass',{
                email: this.email,
            })
        },
    },
    metaInfo() {
        return {
            title: "Recover Password",
        }
    },
}
</script>

<style>
.vs__selected{
    color: #b3b3b3;
  }

.style-chooser .vs__clear,
    .style-chooser .vs__open-indicator {
    fill: #b3b3b3;
  }

.login-box {
    width: 100%;
    margin: auto;
    max-width: 525px;
    min-height: 570px;
    position: relative;
    background: url(https://images.unsplash.com/photo-1507208773393-40d9fc670acf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1268&q=80) no-repeat center;
    box-shadow: 0 12px 15px 0 rgba(0, 0, 0, .24), 0 17px 50px 0 rgba(0, 0, 0, .19)
}

.login-snip {
    width: 100%;
    height: 100%;
    position: absolute;
    padding: 20px 70px 50px 70px;
    background: rgba(0, 77, 77, .9)
}

label.tab{
    color: #FFFFFF80;
}

.login-snip .tab,
.login-space .group .label,
.login-space .group .button {
    text-transform: uppercase
}

/* .login-snip .tab {
    font-size: 22px;
    margin-right: 15px;
    padding-bottom: 5px;
    margin: 0 15px 10px 0;
    display: inline-block;
    border-bottom: 2px solid transparent
} */


.login-space {
    min-height: 345px;
    position: relative;
    perspective: 1000px;
    transform-style: preserve-3d
}

.login-space .group {
    margin-bottom: 15px
}

.login-space .group .label,
.login-space .group .input,
.login-space .group .button {
    width: 100%;
    color: #fff;
    display: block
}

.login-space .group .input,
.login-space .group .button {
    border: none;
    padding: 7px 15px;
    border-radius: 25px;
    background: rgba(255, 255, 255, .1)
}

.login-space .group input[data-type="password"] {
    -webkit-text-security: circle
}

.login-space .group .label {
    color: #aaa;
    font-size: 12px
}

.login-space .group .button {
    background: #1161ee
}

.login-space .group label .icon {
    width: 15px;
    height: 15px;
    border-radius: 2px;
    position: relative;
    display: inline-block;
    background: rgba(255, 255, 255, .1)
}

.login-space .group label .icon:before,
.login-space .group label .icon:after {
    content: '';
    width: 10px;
    height: 2px;
    background: #fff;
    position: absolute;
    transition: all .2s ease-in-out 0s
}

.login-space .group label .icon:before {
    left: 3px;
    width: 5px;
    bottom: 6px;
    transform: scale(0) rotate(0)
}

.login-space .group label .icon:after {
    top: 6px;
    right: 0;
    transform: scale(0) rotate(0)
}

.login-space .group .check:checked+label {
    color: #fff
}

.login-space .group .check:checked+label .icon {
    background: #1161ee
}

.login-space .group .check:checked+label .icon:before {
    transform: scale(1) rotate(45deg)
}

.login-space .group .check:checked+label .icon:after {
    transform: scale(1) rotate(-45deg)
}

*,
:after,
:before {
    box-sizing: border-box
}

.clearfix:after,
.clearfix:before {
    content: '';
    display: table
}

.clearfix:after {
    clear: both;
    display: block
}

a {
    color: inherit;
    text-decoration: none
}
.br {
    margin: 60px 0 50px 0;
    background: rgba(255, 255, 255, .2)
}

.hr {
    height: 2px;
    margin: 60px 0 50px 0;
    background: rgba(255, 255, 255, .2)
}

.foot {
    text-align: center
}

@media only screen and (max-width: 575px) {
  .card {
    width: 500px;
    margin-right: 0;
    }
}

@media only screen and (min-width: 576px) {
  .card {
    width: 500px;
    }
}

::placeholder {
    color: #b3b3b3
}

.style-chooser .vs__search::placeholder,
  .style-chooser .vs__dropdown-toggle,
  .style-chooser .vs__dropdown-menu {
    border: none;
    color: #b3b3b3;
  }
</style>