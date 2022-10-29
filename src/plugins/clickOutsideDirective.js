const clickOutsideDirective = {
  mounted(el, binding) {
    el._clickOutsideHandler_ = ev => {
      if (!(el === ev.target || el.contains(ev.target))) {
        binding.value(/* ev */)
      }
    }
    addEventListener('click', el._clickOutsideHandler_)
  },

  unmounted(el) {
    removeEventListener('click', el._clickOutsideHandler_)
  }
}

export default (app) => {
  app.directive('click-outside', clickOutsideDirective)
}
