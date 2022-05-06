<template>
  <div class="col-full push-top">
    <h1>Editing <i>{{thread.title}}</i></h1>

    <threadEditor :title="thread.title" :text="text" @save="save" @cancel="cancel"/>
  </div>
</template>

<script>
import threadEditor from '@/components/threadEditor.vue'
import { findById } from '@/helpers'

export default {
  components: { threadEditor },
  props: {
    id: { type: String, required: true }
  },

  computed: {
    thread() {
      return findById(this.$store.state.threads, this.id)
    },
    text() {
      return findById(this.$store.state.posts, this.thread.posts[0]).text
    }
  },

  methods: {
    async save({ title, text }) {
      const thread = await this.$store.dispatch('updateThread', {
        title,
        text,
        id: this.id
      })
      this.$router.push({ name: 'Thread', params: { id: thread.id } })
    },

    cancel() {
      this.$router.push({ name: 'Thread', params: { id: this.id } })
    }
  }
}
</script>

<style>

</style>
