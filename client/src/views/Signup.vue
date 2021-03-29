<template>
  <!-- eslint-disable -->
  <section>
    <h1>Signup</h1>
    <div v-if="signingUp">
      <img class="loading-image" src="../assets/infinity_loading.svg" alt="loading animation" />
    </div>
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>
    <form v-if="!signingUp" @submit.prevent="signup()">
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input
          v-model="user.username"
          type="text"
          class="form-control"
          id="username"
          aria-describedby="usernameHelp"
          placeholder="Enter a username"
          required>
        <div id="usernameHelp" class="form-text text-muted">Username must be between 2 and 30 characters. Username can only contain alphanumeric aharacters and under_scores.</div>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          v-model="user.password"
          type="password"
          class="form-control"
          id="password"
          placeholder="Password"
          aria-describedby="passwordHelp"
          required>
          <div id="passwordHelp" class="form-text text-muted">Password must be 8 or more characters long.</div>
      </div>
      <div class="mb-3">
        <label for="confirmPassword" class="form-label">Confirm Password</label>
        <input
          v-model="user.confirmPassword"
          type="password"
          class="form-control"
          id="confirmPassword"
          placeholder="Password"
          aria-describedby="confirmPasswordHelp"
          required>
          <div id="confirmPasswordHelp" class="form-text text-muted">Please confirm your password. </div>
      </div>
      <button type="submit" class="btn btn-primary">Signup!</button>
    </form>
  </section>
</template>

<script>
/* eslint-disable */
import Joi from 'joi';

const SIGNUP_URL = 'http://localhost:5000/auth/signup';

const schema = Joi.object().keys({
  username: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(2).max(30).required(),
  password: Joi.string().trim().min(8).required(),
  confirmPassword: Joi.string().trim().min(8).required(),
});

export default {
  data: () => ({
    signingUp: false,
    errorMessage: '',
    user: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  }),
  watch: {
    user: {
      handler() {
        this.errorMessage = '';
      },
      deep: true,
    },
  },
  methods: {
    signup() {
      this.errorMessage = '';
      if (this.validUser()) {
        const body = {
          username: this.user.username,
          password: this.user.password,
        };
        this.signingUp = true;
        fetch(SIGNUP_URL, {
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
        }).then(() => {
          setTimeout(() => {
            this.signingUp = false;
            this.$router.push('/login');
          }, 1000);
        }).catch((error) => {
          setTimeout(() => {
            this.signingUp = false;
            this.errorMessage = error.message;
          }, 1000);
        });
      }
    },
    validUser() {
      if (this.user.password !== this.user.confirmPassword) {
        this.errorMessage = 'Passwords must match';
        return false;
      }

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
  .loading-img {
    color: #2b3e50;
  }
</style>
