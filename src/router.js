import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home.vue'
import Category from '@/views/category.vue'
import Thread from '@/views/thread.vue'
import ThreadCreate from '@/views/threadCreate.vue'
import ThreadEdit from '@/views/threadEdit.vue'
import Forum from '@/views/forum.vue'
import Register from '@/views/register.vue'
import SignIn from '@/views/signIn.vue'
import Profile from '@/views/profile.vue'
import NotFound from '@/views/notFound404.vue'
import store from './store'
import { findById } from './helpers'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/me',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/me/edit',
    name: 'ProfileEdit',
    component: Profile,
    props: { edit: true },
    meta: { requiresAuth: true }
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
    props: true,
    async beforeEnter(to, from, next) {
      await store.dispatch('threads/fetchThread', { id: to.params.id, once: true })
      const threadExists = findById(store.state.threads.items, to.params.id)
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
    }
  },
  {
    path: '/forum/:forumId/thread/create',
    name: 'ThreadCreate',
    component: ThreadCreate,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: ThreadEdit,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignIn,
    meta: { requiresGuest: true }
  },
  {
    path: '/logout',
    name: 'SignOut',
    async beforeEnter(to, from) {
      await store.dispatch('auth/signOut')
      return { name: 'Home' }
    }
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

router.beforeEach(async (to, from) => {
  await store.dispatch('auth/initAuthentication')
  store.dispatch('unsubscribeAllSnaphshots')
  if (to.meta.requiresAuth && !store.state.auth.authId) {
    return { name: 'SignIn', query: { redirectTo: to.path } }
  }

  if (to.meta.requiresGuest && store.state.auth.authId) {
    return { name: 'Home' }
  }
})

export default router
