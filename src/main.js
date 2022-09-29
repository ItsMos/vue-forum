import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebaseConfig from './config/firebase'
import { initializeApp } from 'firebase/app'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import fontAwesome from './plugins/fontAwesome'

// Initialize Firebase
export const db = getFirestore(initializeApp(firebaseConfig))
onAuthStateChanged(getAuth(), user => {
  store.dispatch('unsubscribeAuthUserSnapshot')
  if (user) {
    store.dispatch('fetchAuthUser')
  }
})
// need to call firebase first with any request before
// trying to fetchItem or it will fail to return data.
getDoc(doc(db, 'posts', 'a'))

const forumApp = createApp(App)
forumApp.use(router)
forumApp.use(store)
forumApp.use(fontAwesome)

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
