<template>
  <theNavbar/>
  <div class="container">
    <router-view v-show='showPage' @ready='onPageReady' :key="$route.path" />
    <AppSpinner v-show="!showPage" />
  </div>
</template>

<script>
import theNavbar from '@/components/theNavbar.vue'
import { mapActions } from 'vuex'
import NProgress from 'nprogress'

export default {
  name: 'App',
  components: {
    theNavbar
  },

  data() {
    return {
      showPage: false
    }
  },

  methods: {
    ...mapActions('auth', ['fetchAuthUser']),
    onPageReady() {
      this.showPage = true
      NProgress.done()
    }
  },

  created() {
    setTimeout(this.fetchAuthUser, 0)
    NProgress.configure({
      speed: 200,
      showSpinner: false
    })
    this.$router.beforeEach(() => {
      this.showPage = false
      NProgress.start()
    })
  }
}
</script>

<style>
  @import 'assets/style.css';
  @import '~nprogress/nprogress.css';
</style>
