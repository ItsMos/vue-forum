import { createStore } from 'vuex'
import sourceData from '@/data'
import { findById, upsert } from '@/helpers'

export default createStore({
  state: {
    ...sourceData,
    // authId: 'rpbB8C6ifrYmNDufMERWfQUoa202'
    authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
    // authId: 'u4r8XCziZEWEXsj2UIKNHBoDh0n2'
  },

  getters: {
    authUser: (state, getters) => {
      return getters.user(state.authId)
    },

    user: state => {
      return id => {
        const user = findById(state.users, id)
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

    thread: state => {
      return id => {
        const thread = findById(state.threads, id)
        return {
          ...thread,
          get author() {
            return findById(state.users, thread.userId)
          },
          get repliesCount() {
            return thread.posts.length - 1
          },
          get contributorsCount() {
            return thread?.contributors?.length || 0
          }
        }
      }
    }
  },

  actions: {
    createPost({ commit, state }, post) {
      post.id = 'po' + Math.random()
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)
      commit('setItem', { resource: 'posts', post })
      commit('appendPostToThread', { childId: post.id, parentId: post.threadId })
      commit('appendContributorToThread', { childId: state.authUser, parentId: post.threadId })
    },

    async createThread({ commit, state, dispatch }, { title, text, forumId }) {
      const id = 'th' + Math.random()
      const userId = state.authId
      const publishedAt = Math.floor(Date.now() / 1000)
      const thread = { forumId, title, publishedAt, userId, id }
      commit('setItem', { resource: 'threads', thread })
      commit('appendThreadToForum', { childId: id, parentId: forumId })
      commit('appendThreadToUser', { childId: id, parentId: userId })
      dispatch('createPost', { text, threadId: id })
      return findById(state.threads, id)
    },

    async updateThread({ commit, state }, { title, text, id }) {
      const thread = findById(state.threads, id)
      const post = findById(state.posts, thread.posts[0])
      const newThread = { ...thread, title }
      const newPost = { ...post, text }
      commit('setItem', { resource: 'threads', newThread })
      commit('setItem', { resource: 'posts', post: newPost })
      return newThread
    }
  },

  mutations: {
    setItem(state, { resource, item }) {
      upsert(state[resource], item)
    },

    appendPostToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }),
    appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' }),
    appendThreadToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'threads' }),
    appendContributorToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'contributors' })
  }
})

function makeAppendChildToParentMutation({ parent, child }) {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId)
    resource[child] = resource[child] || []
    if (!resource[child].includes(childId)) {
      resource[child].push(childId)
    }
  }
}
