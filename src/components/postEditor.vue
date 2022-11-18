<template>
  <div class="col-full">
    <form @submit.prevent="save">
      <div class="form-group">
        <textarea
          v-model="text"
          name=""
          id=""
          cols="30"
          rows="10"
          class="form-input"
        ></textarea>
      </div>
      <div class="form">
        <button class="btn-blue">
          {{ post ? 'Update Post' : 'Submit post' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
    },
  },

  data() {
    return {
      text: this.post?.text || '',
    }
  },

  methods: {
    save() {
      if (this.text.length < 2) return
      let post = { text: this.text }
      if (this.post) {
        post = { ...this.post, text: this.text }
      }
      this.$emit('save', { post })
      if (!this.post) {
        this.text = ''
      }
    },
  },
}
</script>

<style></style>
