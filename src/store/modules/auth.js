import { collection, doc, query, where, getDoc, getDocs, orderBy, limit, startAfter as qStartAfter } from 'firebase/firestore'
import { db } from '@/main'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth'
import { docToResource } from '@/helpers'

export default {
  namespaced: true,
  state: {
    authId: null,
    authUserUnsubscribe: null,
    authObserverUnsubscribe: null
  },
  getters: {
    authUser: (state, getters, rootState, rootGetters) => {
      return rootGetters['users/user'](state.authId)
    }
  },
  actions: {
    initAuthentication({ dispatch, commit, state }) {
      if (state.authObserverUnsubscribe) state.authObserverUnsubscribe()
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(getAuth(), async user => {
          dispatch('unsubscribeAuthUserSnapshot')
          if (user) {
            await dispatch('fetchAuthUser')
            resolve(user)
          } else {
            resolve(null)
          }
        })
        commit('setAuthObserverUnsubscribe', unsubscribe)
      })
    },

    async registerUserWithEmailAndPassword({ dispatch }, user) {
      const result = await createUserWithEmailAndPassword(getAuth(), user.email, user.password)
      delete user.password
      await dispatch('users/createUser', { id: result.user.uid, ...user }, { root: true })
    },
    async signInWithEmailAndPassword(ctx, { email, password }) {
      return signInWithEmailAndPassword(getAuth(), email, password)
    },
    async signInWithGoogle({ dispatch }) {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(getAuth(), provider)
      const user = result.user
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (!userDoc.exists()) {
        return dispatch('users/createUser', { id: user.uid, name: user.displayName, email: user.email, username: user.email, avatar: user.photoURL }, { root: true })
      }
    },
    async signOut({ commit }) {
      await getAuth().signOut()
      commit('setAuthId', null)
    },

    fetchAuthUser: async ({ dispatch, commit }) => {
      const userId = getAuth().currentUser?.uid
      if (!userId) return
      await dispatch('fetchItem', {
        resource: 'users',
        id: userId,
        handleUnsubscribe: unsubscribe => {
          commit('setAuthUserUnsubscribe', unsubscribe)
        }
      },
      { root: true }
      )
      commit('setAuthId', userId)
    },

    fetchAuthUserPosts: async ({ commit, state }, { startAfter }) => {
      console.log('Fetching auth user posts')
      let q = query(collection(db, 'posts'),
        where('userId', '==', state.authId),
        orderBy('publishedAt', 'desc'),
        limit(10)
      )
      if (startAfter) {
        startAfter = await getDoc(doc(db, 'posts', startAfter.id))
        q = query(q, qStartAfter(startAfter))
      }

      let res = await getDocs(q)
      res = res.docs.map(post => {
        post = docToResource(post)
        commit('setItem', { resource: 'posts', item: post }, { root: true })
        return post
      })
      return res
    },

    async unsubscribeAuthUserSnapshot({ state, commit }) {
      if (state.authUserUnsubscribe) {
        state.authUserUnsubscribe()
        commit('setAuthUserUnsubscribe', null)
      }
    }
  },

  mutations: {
    setAuthId(state, id) {
      state.authId = id
    },
    setAuthUserUnsubscribe: (state, unsubscribe) => {
      state.authUserUnsubscribe = unsubscribe
    },
    setAuthObserverUnsubscribe: (state, unsubscribe) => {
      state.authObserverUnsubscribe = unsubscribe
    }
  }
}
