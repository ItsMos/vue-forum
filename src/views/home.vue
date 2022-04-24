<template>
  <h1 class="push-top">Welcome to the forums</h1>
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
