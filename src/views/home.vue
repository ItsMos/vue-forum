<template>
  <div v-if="asyncDataStatus_ready" class="container">
    <h1 class="push-top">Welcome to the forums</h1>
    <categoryList :categories='categories' />
  </div>
</template>

<script>
import categoryList from '@/components/categoryList.vue'
import { mapActions, mapState } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  components: { categoryList },
  mixins: [asyncDataStatus],

  computed: {
    ...mapState('categories', { categories: 'items' })
  },

  methods: {
    ...mapActions('categories', ['fetchAllCategories']),
    ...mapActions('forums', ['fetchForums'])
  },

  async created () {
    const categories = await this.fetchAllCategories()
    const forumIds = categories.map(category => category.forums).flat()
    await this.fetchForums({ ids: forumIds })
    this.asyncDataStatus_fetched()
  }
}
</script>
