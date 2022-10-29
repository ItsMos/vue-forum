import { collection, writeBatch, doc, updateDoc, serverTimestamp, getDoc, arrayUnion, increment } from 'firebase/firestore'
import { db } from '@/main'
import { docToResource } from '@/helpers'
export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {},
  actions: {
    async createPost({ commit, state, rootState }, post) {
      post.userId = rootState.auth.authId
      post.publishedAt = serverTimestamp()

      const batch = writeBatch(db)
      const postRef = doc(collection(db, 'posts'))
      const threadRef = doc(db, 'threads', post.threadId)
      const userRef = doc(db, 'users', rootState.auth.authId)
      batch.set(postRef, post)
      batch.update(threadRef, {
        posts: arrayUnion(postRef.id),
        contributors: arrayUnion(rootState.auth.authId)
      })
      batch.update(userRef, {
        postsCount: increment(1)
      })
      await batch.commit()
      const newPost = await getDoc(postRef)
      commit('setItem', { resource: 'posts', item: docToResource(newPost) }, { root: true })
      commit('threads/appendPostToThread', { childId: newPost.id, parentId: post.threadId }, { root: true })
      commit('threads/appendContributorToThread', { childId: rootState.auth.authUser, parentId: post.threadId }, { root: true })
    },

    async updatePost({ commit, state, rootState }, { text, id }) {
      const post = {
        text,
        edited: {
          at: serverTimestamp(),
          by: rootState.auth.authId,
          moderated: false
        }
      }
      const postRef = doc(db, 'posts', id)
      await updateDoc(postRef, post)
      const updatedPost = await getDoc(postRef)
      commit('setItem', { resource: 'posts', item: updatedPost }, { root: true })
    },

    fetchPost: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'posts', id }, { root: true }),
    fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'posts', ids }, { root: true })
  },
  mutations: {}
}
