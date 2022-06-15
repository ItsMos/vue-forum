<template>
  <h1 class="push-top">Welcome to the forums</h1>
  <categoryList :categories='categories' />
</template>

<script>
import categoryList from '@/components/categoryList.vue'
import { mapActions } from 'vuex'

export default {
  components: {
    categoryList
  },

  computed: {
    categories() {
      return this.$store.state.categories
    }
  },

  methods: {
    ...mapActions(['fetchAllCategories', 'fetchForums'])
  },

  async beforeCreate() {
    const categories = await this.$store.dispatch('fetchAllCategories')
    const forumIds = categories.map(category => category.forums).flat()
    this.$store.dispatch('fetchForums', { ids: forumIds })
  }
}
</script>
