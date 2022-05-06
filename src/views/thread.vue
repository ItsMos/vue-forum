<template>
  <div class='col-large push-top'>
    <h1>
      {{ thread.title }}
      <router-link
        :to="{name: 'ThreadEdit', id: this.id}"
        class="btn-green btn-small"
        tag="button"
      >
        Edit Thread
      </router-link>
    </h1>

    <post-list :posts='threadPosts'/>

    <post-editor @save='addPost' />
  </div>
</template>

<script>
import postList from '@/components/postList.vue'
import postEditor from '@/components/postEditor.vue'
import { findById } from '@/helpers'

export default {
  components: {
    postList,
    postEditor
  },

  props: {
    id: {
      type: String,
      required: true
    }
  },

  computed: {
    threads() {
      return this.$store.state.threads
    },

    posts() {
      return this.$store.state.posts
    },

    thread() {
      return findById(this.threads, this.id)
    },

    threadPosts() {
      return this.posts.filter(p => p.threadId === this.id)
    }
  },

  methods: {
    addPost(ev) {
      const post = {
        ...ev.post,
        threadId: this.id
      }
      this.$store.dispatch('createPost', post)
    }
  }
}
</script>
