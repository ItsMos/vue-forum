<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>

    <threadEditor
      @save="save"
      @cancel="cancel"
      @dirty="formIsDirty = true"
      @clean="formIsDirty = false"
    />
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
    forumId: { type: String, required: true },
  },
  data() {
    return {
      formIsDirty: false,
    }
  },

  computed: {
    forum() {
      return findById(this.$store.state.forums.items, this.forumId)
    },
  },

  methods: {
    ...mapActions('threads', ['createThread']),
    ...mapActions('forums', ['fetchForum']),

    async save({ title, text }) {
      const thread = await this.createThread({
        title,
        text,
        forumId: this.forum.id,
      })
      this.$router.push({ name: 'Thread', params: { id: thread.id } })
    },

    cancel() {
      this.$router.push({ name: 'Forum', params: { id: this.forumId } })
    },
  },

  async created() {
    await this.fetchForum({ id: this.forumId })
    this.asyncDataStatus_fetched()
  },

  beforeRouteLeave() {
    if (this.formIsDirty) {
      const confirmed = window.confirm(
        'Are you sure want to leave? Unsaved changes will be lost!'
      )
      if (!confirmed) return false
    }
  },
}
</script>

<style></style>
