<template>
  <!-- eslint-disable max-len -->
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <a class="navbar-brand" :to="{ name: 'Home' }" role="button">Newb Auth</a>
    </nav>
    <router-view class="container pt-4" />
  </div>
</template>

<style>
</style>
