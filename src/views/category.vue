<template>
  <div v-if="asyncDataStatus_ready" class="container col-full">
    <h1>{{ category.name }}</h1>
    <forumList :title='category.name' :forums='getForumsForCategory(category)' />
  </div>
</template>

<script>
import forumList from '@/components/forumList.vue'
import { findById } from '@/helpers'
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },

  components: { forumList },
  mixins: [asyncDataStatus],

  computed: {
    category() {
      return findById(this.$store.state.categories, this.id) || {}
    }
  },

  methods: {
    ...mapActions(['fetchCategory', 'fetchForums']),
    getForumsForCategory(category) {
      return this.$store.state.forums.filter(f => f.categoryId === category.id)
    }
  },

  async created() {
    const category = await this.fetchCategory({ id: this.id })
    await this.fetchForums({ ids: category.forums })
    this.asyncDataStatus_fetched()
  }
}
</script>

<style>

</style>
