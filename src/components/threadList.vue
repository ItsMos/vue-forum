<template>
  <div class="col-full">
    <div class="thread-list">
      <h2 class="list-title">Threads</h2>

      <div class="thread" v-for="thread in threads" :key="thread.id">
        <div>
          <p>
            <router-link :to="{ name: 'Thread', params: { id: thread.id } }">{{
              thread.title
            }}</router-link>
          </p>
          <p class="text-faded text-xsmall">
            By <a href="#">{{ userById(thread.userId).name }}</a
            >, <AppDate :timestamp="thread.publishedAt" />.
          </p>
        </div>

        <div class="activity">
          <p class="replies-count">
            {{ thread.repliesCount }}
            {{
              thread.repliesCount > 1 || thread.repliesCount === 0
                ? 'replies'
                : 'reply'
            }}
          </p>

          <img
            class="avatar-medium"
            :src="userById(thread.userId).avatar"
            alt=""
          />

          <div>
            <p class="text-xsmall">
              <a href="#">{{ userById(thread.userId).name }}</a>
            </p>
            <p class="text-xsmall text-faded">
              <AppDate :timestamp="thread.publishedAt" />
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { findById } from '@/helpers'
export default {
  props: {
    threads: {
      type: Array,
      required: true,
    },
  },

  computed: {
    posts() {
      return this.$store.state.posts.items
    },

    users() {
      return this.$store.state.users.items
    },
  },

  methods: {
    postById(id) {
      return findById(this.posts, id)
    },
    userById(id) {
      return findById(this.users, id) || {}
    },
  },
}
</script>

<style></style>
