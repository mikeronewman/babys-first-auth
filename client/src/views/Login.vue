<template>
  <!-- eslint-disable -->
  <section>
    <h1>Login</h1>
    <div v-if="loggingIn">
      <img class="loading-image" src="../assets/infinity_loading.svg" alt="loading animation" />
    </div>
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>
    <form v-if="!loggingIn" @submit.prevent="login()">
      <div class="form-group">
        <label for="username">Username</label>
        <input 
          v-model="user.username"
          type="text"
          class="form-control"  
          id="username"
          aria-describedby="usernameHelp"
          placeholder="Enter your username" require>
        <div id="usernameHelp" class="form-text text-muted">Enter your username to login.</div>
      </div>
      <div class="form-group">
        <label for="username">Password</label>
        <input 
          v-model="user.password"
          type="password"
          class="form-control"  
          id="password"
          aria-describedby="passwordHelp"
          placeholder="Enter your password" require>
        <div id="passwordHelp" class="form-text text-muted">Enter your password to login.</div>
      </div>
      <button type="submit" class="btn btn-primary">Login!</button>
    </form>
  </section>
</template>

<script>
import Joi from 'joi';

const LOGIN_URL = 'http://localhost:5000/auth/login';

const schema = Joi.object().keys({
  username: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(2).max(30)
    .required(),
  password: Joi.string().trim().min(8).required(),
});

export default {
  data: () => ({
    loggingIn: false,
    errorMessage: '',
    user: {
      username: '',
      password: '',
    },
  }),
  methods: {
    login() {
      this.errorMessage = '';
      if (this.validUser()) {
        this.loggingIn = true;
        const body = {
          username: this.user.username,
          password: this.user.password,
        };
        fetch(LOGIN_URL, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
          },
        }).then((response) => {
          if (response.ok) {
            return response.json();
          }
          return response.json().then((error) => {
            throw new Error(error.message);
          });
        }).then((result) => {
          localStorage.token = result.token;
          setTimeout(() => {
            this.loggingIn = false;
            this.$router.push('/dashboard');
          }, 1000);
        }).catch((error) => {
          setTimeout(() => {
            this.loggingIn = false;
            this.errorMessage = error.message;
          }, 1000);
        });
      }
    },
    validUser() {
      const result = schema.validate(this.user);

      if (result.error === null) {
        return true;
      }

      if (result.error.message.includes('username')) {
        this.errorMessage = 'Username is invalid';
      } else {
        this.errorMessage = 'Password is invalid';
      }

      return false;
    },
  },
};
</script>

<style>

</style>
