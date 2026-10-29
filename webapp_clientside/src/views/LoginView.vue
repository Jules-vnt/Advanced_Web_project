<template>
  <div class="container py-5">
    <h1>Login</h1>
    <p class="text-muted">Sign in with your manager or driver account.</p>

    <form class="entity-form login-form" @submit.prevent="login">
      <div class="mb-3">
        <label for="login-username" class="form-label">Username</label>
        <input id="login-username" v-model="username" type="text" class="form-control" autocomplete="username" />
      </div>
      <div class="mb-3">
        <label for="login-password" class="form-label">Password</label>
        <input id="login-password" v-model="password" type="password" class="form-control" autocomplete="current-password" />
      </div>
      <button type="submit" class="btn-brand border-0">
        <i class="bi bi-box-arrow-in-right" aria-hidden="true"></i> Log in
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login() {
      // Later: POST request to the server. For now nothing happens.
    }
  }
}
</script>

<style scoped>
.login-form {
  max-width: 420px;
}
</style>
