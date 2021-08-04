import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home.vue'
import Thread from '@/views/thread.vue'
import NotFound from '@/views/notFound404.vue'
import dataSource from '@/data.json'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/thread/:id',
    name: 'Thread',
    component: Thread,
    props: true,
    beforeEnter(to, from, next) {
      const threadExists = dataSource.threads.find(th => th.id === to.params.id)
      if (threadExists) {
        return next()
      } else {
        next({
          name: 'NotFound',
          params: { pathMatch: to.path.substring(1).split('/') },
          query: to.query,
          hash: to.hash
        })
      }
    }
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})
