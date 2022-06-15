<template>
  <h1>{{ category.name }}</h1>

  <forumList :title='category.name' :forums='getForumsForCategory(category)' />
</template>

<script>
import forumList from '@/components/forumList.vue'
import { findById } from '@/helpers'
import { mapActions } from 'vuex'

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
    this.fetchForums({ ids: category.forums })
  }
}
</script>

<style>

</style>
