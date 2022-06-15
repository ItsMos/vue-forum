import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebaseConfig from './config/firebase'
import firebase from 'firebase/compat/app'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
library.add(faUserSecret)

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const forumApp = createApp(App)
forumApp.component('fa', FontAwesomeIcon)
forumApp.use(router)
forumApp.use(store)

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
