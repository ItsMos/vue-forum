<template>
  <h1>{{ category.name }}</h1>

  <forumList :title='category.name' :forums='getForumsForCategory(category)' />
</template>

<script>
import sourceData from '@/data.json'
import forumList from '@/components/forumList.vue'

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
      return sourceData.categories.find(c => c.id === this.id)
    }
  },

  methods: {
    getForumsForCategory(category) {
      return sourceData.forums.filter(f => f.categoryId === category.id)
    }
  }
}
</script>

<style>

</style>
