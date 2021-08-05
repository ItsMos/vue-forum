<template>
  <div class='col-large push-top'>
    <h1>{{ thread.title }}</h1>

    <post-list :posts='threadPosts'/>

    <post-editor @save='addPost' />
  </div>
</template>

<script>
import postList from '@/components/postList.vue'
import postEditor from '@/components/postEditor.vue'

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
      return this.threads.find(th => th.id === this.id)
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
      this.posts.push(post)
      this.thread.posts.push(post.id)
    }
  }
}
</script>
