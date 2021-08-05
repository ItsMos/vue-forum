<template>
  <h1>Welcome to the forum</h1>
  <categoryList :categories='categories' />
</template>

<script>
import categoryList from '@/components/categoryList.vue'

export default {
  components: {
    categoryList
  },

  computed: {
    categories() {
      return this.$store.state.categories
    }
  }
}
</script>
