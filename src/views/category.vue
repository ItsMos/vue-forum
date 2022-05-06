<template>
  <h1>{{ category.name }}</h1>

  <forumList :title='category.name' :forums='getForumsForCategory(category)' />
</template>

<script>
import forumList from '@/components/forumList.vue'
import { findById } from '@/helpers'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },

  components: { forumList },

  computed: {
    category() {
      return findById(this.$store.state.categories, this.id)
    }
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
