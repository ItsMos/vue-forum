import { createStore } from 'vuex'
import sourceData from '@/data'

export default createStore({
  state: {
    ...sourceData,
    // authId: 'rpbB8C6ifrYmNDufMERWfQUoa202'
    authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
    // authId: 'u4r8XCziZEWEXsj2UIKNHBoDh0n2'
  },

  getters: {
    authUser: state => {
      const user = state.users.find(user => user.id === state.authId)
      if (!user) return null
      return {
        ...user,
        get posts() {
          return state.posts.filter(p => p.userId === user.id)
        },

        get postsCount() {
          return this.posts.length
        },

        get threads() {
          return state.threads.filter(th => th.userId === user.id)
        },

        get threadsCount() {
          return this.threads.length
        }
      }
    }
  },

  actions: {
    createPost({ commit, state }, post) {
      post.id = 'po' + Math.random()
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)
      commit('setPost', { post })
      commit('appendPostToThread', { postId: post.id, threadId: post.threadId })
    },

    updateUser({ commit }, user) {
      commit('setUser', { user, userId: user.id })
    }
  },

  mutations: {
    setPost(state, { post }) {
      state.posts.push(post)
    },

    setUser(state, { user, userId }) {
      const userIndex = state.users.findIndex(u => u.id === userId)
      state.users[userIndex] = user
    },

    appendPostToThread(state, { postId, threadId }) {
      const thread = state.threads.find(th => th.id === threadId)
      thread.posts.push(postId)
    }
  }
})
