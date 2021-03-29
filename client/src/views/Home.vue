<template>
    <!-- eslint-disable max-len -->
  <div class="home text-center">
    <div class="jumbotron">
      <h1 class="display-3">Newb Auth</h1>
      <p class="lead">Learning auth is fun or something.</p>
      <hr class="my-4">
      <p>Please log in to my website because it doesn't do anything and I'm definitely not going to sell your information.</p>
      <p class="lead">
        <router-link class="btn btn-primary btn-lg" :to="{ name: 'Signup' }" role="button" >Sign Up</router-link>
      </p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {

  },
};
</script>
