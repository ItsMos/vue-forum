import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebaseConfig from './config/firebase'
import { initializeApp } from 'firebase/app'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import fontAwesome from './plugins/fontAwesome'
import clickOutsideDirective from './plugins/clickOutsideDirective'
import pageScrollDirective from './plugins/pageScrollDirective'
import vPagination from './plugins/vue3Pagination'

// Initialize Firebase
export const db = getFirestore(initializeApp(firebaseConfig))

// need to call firebase first with any request before
// trying to fetchItem or it will fail to return data.
getDoc(doc(db, 'posts', 'a'))

const forumApp = createApp(App)
forumApp.use(router)
forumApp.use(store)
forumApp.use(fontAwesome)
forumApp.use(clickOutsideDirective)
forumApp.use(pageScrollDirective)
forumApp.use(vPagination)

const requireComponent = require.context('./components', true, /App[A-Z]\w+\.(vue|js)$/)
requireComponent.keys().forEach(function (fileName) {
  let baseComponentConfig = requireComponent(fileName)
  baseComponentConfig = baseComponentConfig.default || baseComponentConfig
  const baseComponentName = baseComponentConfig.name || (
    fileName
      .replace(/^.+\//, '')
      .replace(/\.\w+$/, '')
  )
  forumApp.component(baseComponentName, baseComponentConfig)
})

forumApp.mount('#app')
