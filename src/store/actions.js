import {
  collection,
  onSnapshot,
  writeBatch,
  doc,
  query,
  where,
  updateDoc,
  serverTimestamp,
  getDoc,
  setDoc,
  arrayUnion,
  increment
} from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { db } from '../main'
import { findById, docToResource } from '@/helpers'

export default {
  async createPost({ commit, state }, post) {
    post.userId = state.authId
    post.publishedAt = serverTimestamp()

    const batch = writeBatch(db)
    const postRef = doc(collection(db, 'posts'))
    const threadRef = doc(db, 'threads', post.threadId)
    const userRef = doc(db, 'users', state.authId)
    batch.set(postRef, post)
    batch.update(threadRef, {
      posts: arrayUnion(postRef.id),
      contributors: arrayUnion(state.authId)
    })
    batch.update(userRef, {
      postsCount: increment(1)
    })
    await batch.commit()
    const newPost = await getDoc(postRef)
    commit('setItem', { resource: 'posts', item: docToResource(newPost) })
    commit('appendPostToThread', { childId: newPost.id, parentId: post.threadId })
    commit('appendContributorToThread', { childId: state.authUser, parentId: post.threadId })
  },

  async updatePost({ commit, state }, { text, id }) {
    const post = {
      text,
      edited: {
        at: serverTimestamp(),
        by: state.authId,
        moderated: false
      }
    }
    const postRef = doc(db, 'posts', id)
    await updateDoc(postRef, post)
    const updatedPost = await getDoc(postRef)
    commit('setItem', { resource: 'posts', item: updatedPost })
  },

  async createThread({ commit, state, dispatch }, { title, text, forumId }) {
    const userId = state.authId
    const publishedAt = serverTimestamp()
    const threadRef = doc(collection(db, 'threads'))
    const thread = { forumId, title, publishedAt, userId, id: threadRef.id }
    const forumRef = doc(db, 'forums', forumId)
    const userRef = doc(db, 'users', userId)
    const batch = writeBatch(db)

    batch.set(threadRef, thread)
    batch.update(userRef, {
      threads: arrayUnion(threadRef.id)
    })
    batch.update(forumRef, {
      threads: arrayUnion(threadRef.id)
    })
    await batch.commit()
    const newThread = await getDoc(threadRef)

    commit('setItem', { resource: 'threads', item: docToResource(newThread) })
    commit('appendThreadToForum', { childId: threadRef.id, parentId: forumId })
    commit('appendThreadToUser', { childId: threadRef.id, parentId: userId })
    await dispatch('createPost', { text, threadId: threadRef.id })
    return findById(state.threads, threadRef.id)
  },

  async updateThread({ commit, state }, { title, text, id }) {
    const thread = findById(state.threads, id)
    const post = findById(state.posts, thread.posts[0])
    let newThread = { ...thread, title }
    let newPost = { ...post, text }
    const threadRef = doc(db, 'threads', id)
    const postRef = doc(db, 'posts', post.id)
    const batch = writeBatch(db)
    batch.update(threadRef, newThread)
    batch.update(postRef, newPost)
    await batch.commit()
    newThread = await getDoc(threadRef)
    newPost = await getDoc(postRef)
    commit('setItem', { resource: 'threads', item: newThread })
    commit('setItem', { resource: 'posts', item: newPost })
    return docToResource(newThread)
  },

  async registerUserWithEmailAndPassword({ dispatch }, user) {
    const auth = getAuth()
    const result = await createUserWithEmailAndPassword(auth, user.email, user.password)
    delete user.password
    await dispatch('createUser', { id: result.user.uid, ...user })
  },
  async signInWithEmailAndPassword(ctx, { email, password }) {
    return signInWithEmailAndPassword(getAuth(), email, password)
  },
  async signOut({ commit }) {
    await getAuth().signOut()
    commit('setAuthId', null)
  },
  async createUser({ commit }, user) {
    user.registeredAt = serverTimestamp()
    user.usernameLower = user.username.toLowerCase()
    user.email = user.email.toLowerCase()
    const userRef = doc(db, 'users', user.id)
    await setDoc(userRef, user)
    const newUser = await getDoc(userRef)
    commit('setItem', { resource: 'users', item: newUser })
    return docToResource(newUser)
  },
  updateUser({ commit }, user) {
    commit('setItem', { resource: 'users', item: user, userId: user.id })
  },

  fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'categories', id }),
  fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'forums', id }),
  fetchThread: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'threads', id }),
  fetchPost: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'posts', id }),
  fetchUser: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'users', id }),
  fetchAuthUser: async ({ dispatch, commit }) => {
    const userId = getAuth().currentUser?.uid
    if (!userId) return
    dispatch('fetchItem', { resource: 'users', id: userId })
    commit('setAuthId', userId)
  },

  fetchUserPosts: ({ commit }, { userId }) => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onSnapshot(
        query(collection(db, 'posts'), where('userId', '==', userId)),
        userPosts => {
          userPosts = userPosts.docs.map(post => {
            post = docToResource(post)
            commit('setItem', { resource: 'posts', item: post })
            return post
          })
          resolve(userPosts)
        }
      )
      commit('appendUnsubscribe', { unsubscribe })
    })
  },

  fetchAllCategories({ commit }) {
    console.log('fetching all categories')
    return new Promise(resolve => {
      const unsubscribe = onSnapshot(query(collection(db, 'categories')), (querySnapshot) => {
        const categories = querySnapshot.docs.map(doc => {
          const item = docToResource(doc)
          commit('setItem', { resource: 'categories', item })
          return item
        })
        resolve(categories)
        commit('appendUnsubscribe', { unsubscribe })
      })
    })
  },

  fetchCategories: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'categories', ids }),
  fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'forums', ids }),
  fetchThreads: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'threads', ids }),
  fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'posts', ids }),
  fetchUsers: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'users', ids }),

  fetchItem({ commit }, { id, resource }) {
    console.log('fetching from ' + resource, id)
    return new Promise((resolve) => {
      const unsubscribe = onSnapshot(doc(db, resource, id), doc => {
        const item = docToResource(doc)
        commit('setItem', { resource, item })
        resolve(item)
      })
      commit('appendUnsubscribe', { unsubscribe })
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
