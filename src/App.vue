<template>
  <theNavbar/>
  <div class="container">
    <router-view />
  </div>
</template>

<script>
import theNavbar from '@/components/theNavbar.vue'
import { mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    theNavbar
  },

  methods: {
    ...mapActions(['fetchAuthUser'])
  },

  created() {
    this.fetchAuthUser()
  }
}
</script>

<style>
  @import 'assets/style.css'
</style>
