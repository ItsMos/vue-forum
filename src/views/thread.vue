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
      By <a href="#" class="link-unstyled">{{thread.author?.name}}</a>, <AppDate :timestamp='thread.publishedAt'/>.
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
import { mapActions } from 'vuex'

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
    ...mapActions(['createPost', 'fetchThread', 'fetchPosts', 'fetchUsers']),

    addPost(ev) {
      const post = {
        ...ev.post,
        threadId: this.id
      }
      this.createPost(post)
    }
  },

  async created() {
    // fetch thread
    const thread = await this.fetchThread({ id: this.id })

    // fetch posts
    const posts = await this.fetchPosts({ ids: thread.posts })
    // fetch the user for each post
    const users = posts.map(post => post.userId).concat(thread.userId)
    this.fetchUsers({ ids: users })
  }
}
</script>
