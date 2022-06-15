<template>
  <div v-if="forum" class="col-full push-top">

    <div class="forum-header">
      <div class="forum-details">
        <h1>{{ forum.name }}</h1>
        <p class="text-lead">{{ forum.description }}</p>
      </div>
      <router-link
        :to="{name: 'ThreadCreate', params: {forumId: forum.id}}"
        class="btn-green btn-small"
      >
        Start a thread
      </router-link>
    </div>
  </div>

  <div v-if="threadsFetched" class="col-full push-top">
    <thread-list :threads='threads' />
  </div>

</template>

<script>
import threadList from '@/components/threadList.vue'
import { findById } from '@/helpers'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: { threadList },
  props: {
    id: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      threadsFetched: false
    }
  },

  computed: {
    ...mapGetters(['thread']),

    forum () {
      return findById(this.$store.state.forums, this.id)
    },

    threads () {
      if (!this.forum) return []
      return this.forum.threads.map(threadId => this.thread(threadId))
    }
  },

  methods: {
    ...mapActions(['fetchForum', 'fetchThreads', 'fetchUsers'])
  },

  async created() {
    const forum = await this.fetchForum({ id: this.id })
    const threads = await this.fetchThreads({ ids: forum.threads })
    this.threadsFetched = true
    this.fetchUsers({ ids: threads.map(th => th.userId) })
  }
}
</script>

<style>

</style>
