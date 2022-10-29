<template>
  <div v-if="asyncDataStatus_ready" class='col-large push-top'>
    <h1>
      {{ thread.title }}
      <router-link
        v-if="thread.userId === authUser?.id"
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

    <post-editor v-if="authUser" @save='addPost' />
    <div v-else class="text-center" style="margin-bottom: 50px;">
      <router-link :to="{name: 'SignIn', query: {redirectTo: $route.path}}">Sign In</router-link> or <router-link :to="{name: 'Register', query: {redirectTo: $route.path}}">Register</router-link> to reply
    </div>
  </div>
</template>

<script>
import postList from '@/components/postList.vue'
import postEditor from '@/components/postEditor.vue'
import { mapActions, mapGetters } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  components: {
    postList,
    postEditor
  },
  mixins: [asyncDataStatus],

  props: {
    id: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapGetters('auth', ['authUser']),

    posts() {
      return this.$store.state.posts.items
    },

    thread() {
      return this.$store.getters['threads/thread'](this.id)
    },

    threadPosts() {
      return this.posts.filter(p => p.threadId === this.id)
    }
  },

  methods: {
    ...mapActions('posts', ['createPost', 'fetchPosts']),
    ...mapActions('threads', ['fetchThread']),
    ...mapActions('users', ['fetchUsers']),

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
    let users = posts.map(post => post.userId)
    users = users.filter((id, index) => users.indexOf(id) === index)
    await this.fetchUsers({ ids: users })
    this.asyncDataStatus_fetched()
  }
}
</script>
