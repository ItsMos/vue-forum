<template>
  <h1 class="push-top">Welcome to the forums</h1>
  <categoryList :categories='categories' />
</template>

<script>
import categoryList from '@/components/categoryList.vue'
import { mapActions, mapState } from 'vuex'

export default {
  components: {
    categoryList
  },

  computed: {
    ...mapState(['categories'])
  },

  methods: {
    ...mapActions(['fetchAllCategories', 'fetchForums'])
  },

  async created () {
    const categories = await this.fetchAllCategories()
    const forumIds = categories.map(category => category.forums).flat()
    this.fetchForums({ ids: forumIds })
  }
}
</script>
