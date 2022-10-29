import { doc, updateDoc, serverTimestamp, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/main'
import { findById, docToResource, makeAppendChildToParentMutation } from '@/helpers'
export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {
    user: (state, getters, rootState) => {
      return id => {
        const user = findById(state.items, id)
        if (!user) return null
        return {
          ...user,
          get posts() {
            return rootState.posts.items.filter(p => p.userId === user.id)
          },

          get postsCount() {
            return user.postsCount || 0
          },

          get threads() {
            return rootState.threads.items.filter(th => th.userId === user.id)
          },

          get threadsCount() {
            return user.threads?.length || 0
          }
        }
      }
    }
  },
  actions: {
    async createUser({ commit }, user) {
      user.registeredAt = serverTimestamp()
      user.usernameLower = user.username.toLowerCase()
      user.email = user.email.toLowerCase()
      const userRef = doc(db, 'users', user.id)
      await setDoc(userRef, user)
      const newUser = await getDoc(userRef)
      commit('setItem', { resource: 'users', item: newUser }, { root: true })
      return docToResource(newUser)
    },
    async updateUser({ commit }, user) {
      const updates = {
        avatar: user.avatar || null,
        username: user.username || null,
        name: user.name || null,
        bio: user.bio || null,
        website: user.website || null,
        email: user.email || null,
        location: user.location || null
      }
      await updateDoc(doc(db, 'users', user.id), updates)
      commit('setItem', { resource: 'users', item: user, userId: user.id }, { root: true })
    },
    fetchUser: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'users', id }, { root: true }),
    fetchUsers: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'users', ids }, { root: true })
  },
  mutations: {
    appendThreadToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'threads' })
  }
}
