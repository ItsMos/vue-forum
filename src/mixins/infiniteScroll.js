export default {
  data() {
    return {
      handler: null,
      lastTrigger: null
    }
  },

  methods: {
    isScrolledToBototm() {
      // is at 95% of the page
      return innerHeight + scrollY >= document.body.offsetHeight * 95 / 100
    },

    wrapperFunc() {
      if (this.isScrolledToBototm()) {
        if (this.lastTrigger && Date.now() - this.lastTrigger <= 1000) return
        else this.lastTrigger = Date.now()
        this.handler()
      }
    },

    setupInfiniteScroll(handler) {
      this.handler = handler
      addEventListener('scroll', this.wrapperFunc)
    },

    removeInfiniteScroll() {
      removeEventListener('scroll', this.wrapperFunc)
      this.handler = null
    }
  }
}
