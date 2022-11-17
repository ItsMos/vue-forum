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
import useNotifications from '@/composables/useNotifications'
import difference from 'lodash/difference'

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

  setup() {
    const { addNotification } = useNotifications()
    return { addNotification }
  },

  mixins: [asyncDataStatus],

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
    },

    async fetchPostsWithUsers(ids) {
      // fetch posts
      const posts = await this.fetchPosts({
        ids,
        onSnapshot: ({ isLocal, previousItem }) => {
          if (!this.asyncDataStatus_ready || isLocal ||
            (previousItem?.edited && !previousItem?.edited?.at)
          ) return
          this.addNotification({ message: 'Thread recently updated', timeout: 5000 })
        }
      })
      // fetch the user for each post
      let users = posts.map(post => post.userId)
      users = users.filter((id, index) => users.indexOf(id) === index)
      await this.fetchUsers({ ids: users })
    }
  },

  async created() {
    // fetch thread
    const thread = await this.fetchThread({
      id: this.id,
      onSnapshot: ({ isLocal, item, previousItem }) => {
        if (!this.asyncDataStatus_ready || isLocal) return
        const newPostIds = difference(item.posts, previousItem.posts)
        const hasNewPosts = newPostIds.length > 0
        if (hasNewPosts) {
          this.fetchPostsWithUsers(newPostIds)
        } else {
          this.addNotification({ message: 'Thread recently updated', timeout: 5000 })
        }
      }
    })

    this.fetchPostsWithUsers(thread.posts)
    this.asyncDataStatus_fetched()
  }
}
</script>
