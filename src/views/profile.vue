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
export default {
  components: { postList, userProfileCard, userProfileCardEditor },

  props: {
    edit: { type: Boolean, default: false }
  },

  computed: {
    ...mapGetters({
      user: 'authUser'
    })
  },

  created() {
    this.$store.dispatch('fetchUserPosts', { userId: this.user.id })
  }
}

</script>

<style>

</style>
