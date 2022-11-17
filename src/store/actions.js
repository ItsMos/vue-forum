import { onSnapshot as fsOnSnapshot, doc } from 'firebase/firestore'
import { db } from '@/main'
import { docToResource, findById } from '@/helpers'

export default {
  fetchItem({ commit, state }, { id, resource, handleUnsubscribe = null, once = false, onSnapshot = null }) {
    console.log('fetching from ' + resource, id)
    return new Promise((resolve) => {
      const unsubscribe = fsOnSnapshot(doc(db, resource, id), doc => {
        if (once) {
          unsubscribe()
        }
        if (doc.exists()) {
          const item = docToResource(doc)
          let previousItem = findById(state[resource].items, id)
          previousItem = previousItem ? { ...previousItem } : null
          commit('setItem', { resource, item })
          if (typeof onSnapshot === 'function') {
            const isLocal = doc.metadata.hasPendingWrites
            onSnapshot({ item: { ...item }, previousItem, isLocal })
          }
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

  fetchItems({ dispatch }, { ids, resource, onSnapshot = null }) {
    return Promise.all(ids.map(id => dispatch('fetchItem', { id, resource, onSnapshot })))
  },

  async unsubscribeAllSnaphshots({ state, commit }) {
    state.unsubscribes.forEach(unsubscribe => unsubscribe())
    commit('clearAllUnsubscribes')
  }
}
