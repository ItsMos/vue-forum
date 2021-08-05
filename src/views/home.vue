<template>
  <h1>Welcome to the forum</h1>
  <categoryList :categories='categories' />
</template>

<script>
import sourceData from '@/data.json'
import categoryList from '@/components/categoryList.vue'

export default {
  components: {
    categoryList
  },

  data() {
    return {
      categories: sourceData.categories
    }
  }
}
</script>
