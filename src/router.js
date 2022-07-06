import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home.vue'
import Category from '@/views/category.vue'
import Thread from '@/views/thread.vue'
import ThreadCreate from '@/views/threadCreate.vue'
import ThreadEdit from '@/views/threadEdit.vue'
import Forum from '@/views/forum.vue'
import Profile from '@/views/profile.vue'
import NotFound from '@/views/notFound404.vue'
import store from './store'
// import dataSource from '@/data.json'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/me',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/me/edit',
    name: 'ProfileEdit',
    component: Profile,
    props: { edit: true }
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: Category,
    props: true
  },
  {
    path: '/forum/:id',
    name: 'Forum',
    component: Forum,
    props: true
  },
  {
    path: '/thread/:id',
    name: 'Thread',
    component: Thread,
    props: true
    /* beforeEnter(to, from, next) {
      const threadExists = findById(dataSource.threads, to.params.id)
      if (threadExists) {
        return next()
      } else {
        next({
          name: 'NotFound',
          // preserve the wrong url, query and hash
          params: { pathMatch: to.path.substring(1).split('/') },
          query: to.query,
          hash: to.hash
        })
      }
    } */
  },
  {
    path: '/forum/:forumId/thread/create',
    name: 'ThreadCreate',
    component: ThreadCreate,
    props: true
  },
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: ThreadEdit,
    props: true
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

router.beforeEach(() => {
  store.dispatch('unsubscribeAllSnaphshots')
})

export default router
