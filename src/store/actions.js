import { onSnapshot, doc } from 'firebase/firestore'
import { db } from '@/main'
import { docToResource } from '@/helpers'

export default {
  fetchItem({ commit }, { id, resource, handleUnsubscribe = null }) {
    console.log('fetching from ' + resource, id)
    return new Promise((resolve) => {
      const unsubscribe = onSnapshot(doc(db, resource, id), doc => {
        if (doc.exists()) {
          const item = docToResource(doc)
          commit('setItem', { resource, item })
          resolve(item)
        } else {
          resolve(null)
        }
      })
      if (handleUnsubscribe) {
        handleUnsubscribe(unsubscribe)
      } else {
        commit('appendUnsubscribe', { unsubscribe })
      }
    })
  },

  fetchItems({ dispatch }, { ids, resource }) {
    return Promise.all(ids.map(id => dispatch('fetchItem', { id, resource })))
  },

  async unsubscribeAllSnaphshots({ state, commit }) {
    state.unsubscribes.forEach(unsubscribe => unsubscribe())
    commit('clearAllUnsubscribes')
  }
}
