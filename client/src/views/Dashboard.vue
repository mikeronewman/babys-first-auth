<template>
  <!-- eslint-disable -->
  <section>
    <h1 v-if="!user">Getting user information...</h1>
    <h1 v-if="user">Hello, {{ user.username }}!</h1>
    <button @click="logout()" type="submit" class="btn btn-primary">Logout</button>
    <button @click="showForm = !showForm" type="submit" class="btn btn-info">Toggle Form</button>
    <form v-if="showForm" @submit.prevent="addNote()">
      <div class="form-group">
        <label for="title">Title</label>
        <input 
          v-model="newNote.title" 
          type="text" 
          class="form-control" 
          id="title" 
          aria-describedby="titleHelp" 
          placeholder="Enter a title" required>
        <div id="titleHelp" class="form-text text-muted">Please enter the title of your note.</div>
      </div>
      <div class="form-group">
        <label for="note">Note</label>
        <textarea 
          v-model="newNote.note"
          class="form-control" 
          id="note" 
          rows="3" 
          placeholder="Enter your note" required></textarea>
      </div>
      <button type="submit" class="btn btn-success">Add Note</button>
    </form>
  </section>
</template>

<script>
const API_URL = 'http://localhost:5000/';

export default {
  data: () => ({
    showForm: true,
    user: null,
    newNote: {
      title: '',
      note: '',
    },
  }),
  mounted() {
    fetch(API_URL, {
      headers: {
        authorization: `Bearer ${localStorage.token}`,
      },
    }).then((res) => res.json())
      .then((result) => {
        if (result.user) {
          this.user = result.user;
        } else {
          this.logout();
        }
      });
  },
  methods: {
    addNote() {
      fetch(`${API_URL}api/vi/notes`, {
        method: 'POST',
        body: JSON.stringify(this.newNote),
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res) => res.json())
        .then((note) => {
          console.log(note);
        });
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },
  },
};
</script>

<style>

</style>
