<template>
  <div class="col-full text-center">
    <h1>404 Not Found</h1>
    <router-link :to="{ name: 'Home' }">Back to home page</router-link>
  </div>
</template>

<script>
export default {
  created() {
    this.$emit('ready')
  },
}
</script>
