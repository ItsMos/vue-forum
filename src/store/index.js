import { createStore } from 'vuex'
import actions from '@/store/actions'
import getters from '@/store/getters'
import mutations from '@/store/mutations'

export default createStore({
  state: {
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    users: [],
    // authId: 'rpbB8C6ifrYmNDufMERWfQUoa202'
    authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
    // authId: 'u4r8XCziZEWEXsj2UIKNHBoDh0n2'
  },

  getters,
  actions,
  mutations
})
