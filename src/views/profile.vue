<template>
  <div v-if="user" class="flex-grid">
    <div class="col-3 push-top">

      <userProfileCard v-if="!edit" :user="user" />
      <userProfileCardEditor v-else :user="user" />

    </div>

    <div class="col-7 push-top">

      <div class="profile-header">
        <span class="text-lead">
          {{user.username}}'s recent activity
        </span>
        <a href="#">See only started threads?</a>
      </div>

      <hr>

      <postList :posts='user.posts'/>
    </div>
  </div>
</template>

<script>
import postList from '@/components/postList.vue'
import userProfileCard from '@/components/userProfileCard.vue'
import userProfileCardEditor from '@/components/userProfileCardEditor.vue'
import { mapGetters } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import infiniteScroll from '@/mixins/infiniteScroll'
export default {
  components: { postList, userProfileCard, userProfileCardEditor },

  mixins: [asyncDataStatus, infiniteScroll],

  props: {
    edit: { type: Boolean, default: false }
  },

  computed: {
    ...mapGetters('auth', { user: 'authUser' }),
    lastPostFetched() {
      if (this.user.posts.length === 0) return null
      return this.user.posts[this.user.posts.length - 1]
    }
  },

  async created() {
    await this.$store.dispatch('auth/fetchAuthUserPosts', { startAfter: this.lastPostFetched })
    this.asyncDataStatus_fetched()
    this.setupInfiniteScroll(async () => {
      const posts = await this.$store.dispatch('auth/fetchAuthUserPosts', { startAfter: this.lastPostFetched })
      if (posts && this.user.posts.length >= this.user.postsCount) {
        this.removeInfiniteScroll()
      }
    })
  }
}

</script>
