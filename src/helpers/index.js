export const findById = (resources, id) => {
  if (!resources) return null
  return resources.find((r) => r.id === id)
}

export const upsert = (resources, resource) => {
  const index = resources.findIndex((r) => r.id === resource.id)
  if (resource.id && index !== -1) {
    resources[index] = resource
  } else {
    resources.push(resource)
  }
}

export const docToResource = (doc) => {
  if (typeof doc?.data !== 'function') return doc
  return { ...doc.data(), id: doc.id }
}

export const makeAppendChildToParentMutation = ({ parent, child }) => {
  return (state, { childId, parentId }) => {
    const resource = findById(state.items, parentId)
    if (!resource) {
      console.warn(
        `Appending ${child} ${childId} to ${parent} ${parentId} failed because the parent didn't exist`
      )
      return
    }
    resource[child] = resource[child] || []
    if (!resource[child].includes(childId)) {
      resource[child].push(childId)
    }
  }
}

export const makeFetchItemAction = ({ resource }) => {
  return ({ dispatch }, payload) =>
    dispatch('fetchItem', { resource, ...payload }, { root: true })
}
export const makeFetchItemsAction = ({ resource }) => {
  return ({ dispatch }, payload) =>
    dispatch('fetchItems', { resource, ...payload }, { root: true })
}
