<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>Editing <i>{{thread.title}}</i></h1>

    <threadEditor :title="thread.title" :text="text" @save="save" @cancel="cancel" @dirty='formIsDirty = true' @clean='formIsDirty = false'/>
  </div>
</template>

<script>
import threadEditor from '@/components/threadEditor.vue'
import { findById } from '@/helpers'
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  components: { threadEditor },
  mixins: [asyncDataStatus],
  props: {
    id: { type: String, required: true }
  },
  data() {
    return {
      formIsDirty: false
    }
  },

  computed: {
    thread() {
      return findById(this.$store.state.threads, this.id)
    },
    text() {
      const post = findById(this.$store.state.posts, this.thread.posts[0])
      return post ? post.text : ''
    }
  },

  methods: {
    ...mapActions(['updateThread', 'fetchThread', 'fetchPost']),

    async save({ title, text }) {
      const thread = await this.updateThread({
        title,
        text,
        id: this.id
      })
      this.$router.push({ name: 'Thread', params: { id: thread.id } })
    },

    cancel() {
      this.$router.push({ name: 'Thread', params: { id: this.id } })
    }
  },

  async created() {
    const thread = await this.fetchThread({ id: this.id })
    await this.fetchPost({ id: thread.posts[0] })
    this.asyncDataStatus_fetched()
  },

  beforeRouteLeave() {
    if (this.formIsDirty) {
      const confirmed = window.confirm('Are you sure want to leave? Unsaved changes will be lost!')
      if (!confirmed) return false
    }
  }
}
</script>

<style>

</style>
