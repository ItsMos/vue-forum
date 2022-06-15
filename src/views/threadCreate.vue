<template>
  <div v-if="forum" class="col-full push-top">
    <h1>Create new thread in <i>{{forum.name}}</i></h1>

    <threadEditor @save='save' @cancel='cancel'/>
  </div>
</template>

<script>
import threadEditor from '@/components/threadEditor.vue'
import { findById } from '@/helpers'
import { mapActions } from 'vuex'

export default {
  components: { threadEditor },
  props: {
    forumId: { type: String, required: true }
  },

  computed: {
    forum() {
      return findById(this.$store.state.forums, this.forumId)
    }
  },

  methods: {
    ...mapActions(['createThread', 'fetchForum']),

    async save({ title, text }) {
      const thread = await this.createThread({
        title,
        text,
        forumId: this.forum.id
      })
      this.$router.push({ name: 'Thread', params: { id: thread.id } })
    },

    cancel() {
      this.$router.push({ name: 'Forum', params: { id: this.forumId } })
    }
  },

  created() {
    this.fetchForum({ id: this.forumId })
  }
}
</script>

<style>

</style>
