import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebaseConfig from './config/firebase'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import fontAwesome from './plugins/fontAwesome'

// Initialize Firebase
export const db = getFirestore(initializeApp(firebaseConfig))
onAuthStateChanged(getAuth(), user => {
  console.log('state changed', user)
  if (user) {
    // trying to fix no return of user data happening
    setTimeout(() => {
      store.dispatch('fetchAuthUser')
    }, 0)
  }
})

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
