<template>
  <div class="col-full push-top">

    <div class="forum-header">
      <div class="forum-details">
        <h1>{{ forum.name }}</h1>
        <p class="text-lead">{{ forum.description }}</p>
      </div>
      <a href="new-thread.html" class="btn-green btn-small">Start a thread</a>
    </div>
  </div>

  <div class="col-full push-top">
    <thread-list :threads='threads' />
  </div>

</template>

<script>
import threadList from '@/components/threadList.vue'

export default {
  components: { threadList },
  props: {
    id: {
      type: String,
      required: true
    }
  },

  computed: {
    forum () {
      return this.$store.state.forums.find(f => f.id === this.id)
    },

    threads () {
      return this.$store.state.threads.filter(th => th.forumId === this.id)
    }
  }
}
</script>

<style>

</style>
