import debounce from 'lodash/debounce'
const pageScrollDirective = {
  mounted(el, binding) {
    el._pageScroll_ = debounce(() => { console.log('scroll'); binding.value() }, 200, { leading: true })
    addEventListener('scroll', el._pageScroll_)
  },
  unmounted(el) {
    removeEventListener('scroll', el._pageScroll_)
  }
}
export default (app) => {
  app.directive('page-scroll', pageScrollDirective)
}
