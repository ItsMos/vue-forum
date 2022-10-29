import { onSnapshot, query, collection } from 'firebase/firestore'
import { db } from '@/main'
import { docToResource } from '@/helpers'
export default {
  namespaced: true,
  state: {
    items: []
  },

  getters: {},
  actions: {
    fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'categories', id }, { root: true }),
    fetchCategories: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'categories', ids }, { root: true }),
    fetchAllCategories({ commit }) {
      console.log('fetching all categories')
      return new Promise(resolve => {
        const unsubscribe = onSnapshot(query(collection(db, 'categories')), (querySnapshot) => {
          const categories = querySnapshot.docs.map(doc => {
            const item = docToResource(doc)
            commit('setItem', { resource: 'categories', item }, { root: true })
            return item
          })
          resolve(categories)
          commit('appendUnsubscribe', { unsubscribe }, { root: true })
        })
      })
    }
  },
  mutations: {}
}
