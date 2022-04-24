<template>
  <theNavbar/>
  <div class="container">
    <router-view />
  </div>
</template>

<script>
import theNavbar from '@/components/theNavbar.vue'

export default {
  name: 'App',
  components: {
    theNavbar
  }
}
</script>

<style>
  @import 'assets/style.css'
</style>
