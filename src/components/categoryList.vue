<template>
  <forumList
    v-for="category in categories" :key="category.id"
    :forums='getForumsForCategory(category)'
    :title='category.name'
    :category-id='category.id'
  />
</template>

<script>
import forumList from '@/components/forumList.vue'
export default {
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  components: {
    forumList
  },

  methods: {
    getForumsForCategory(category) {
      return this.$store.state.forums.filter(f => f.categoryId === category.id)
    }
  }
}
</script>

<style>

</style>
