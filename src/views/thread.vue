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

    <p>
      By <a href="#" class="link-unstyled">{{thread.author.name}}</a>, <AppDate :timestamp='thread.publishedAt'/>.
      <span style="float:right; margin-top: 2px;" class="hide-mobile text-faded text-small">
        {{thread.repliesCount}} replies by {{thread.contributorsCount}} contributors
      </span>
    </p>
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
      return this.$store.getters.thread(this.id)
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
