import { createStore } from 'vuex'
import sourceData from '@/data'

export default createStore({
  state: {
    ...sourceData,
    authId: 'rpbB8C6ifrYmNDufMERWfQUoa202'
    // authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
  },

  getters: {
    authUser: state => state.users.find(user => user.id === state.authId)
  },

  actions: {
    createPost(store, post) {
      post.id = 'po' + Math.random()
      store.commit('setPost', { post })
      store.commit('appendPostToThread', { postId: post.id, threadId: post.threadId })
    }
  },

  mutations: {
    setPost(state, { post }) {
      state.posts.push(post)
    },
    appendPostToThread(state, { postId, threadId }) {
      const thread = state.threads.find(th => th.id === threadId)
      thread.posts.push(postId)
    }
  }
})
