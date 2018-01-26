const storage = {
  storageName: 'civgame',
  localStore: (localStorage.getItem('civgame')) ? localStorage.getItem('civgame') : '[]',
  get: function (name) {
    let store = this.localStore
    if (this.localStore) {
      store = JSON.parse(this.localStore)
    }
    const item = store.find(obj => Object.keys(obj)[0] === name)
    if (item) {
      return item[name]
    }

    return ''
  },

  set: function (name, value) {
    let store = this.localStore
    if (this.localStore) {
      store = JSON.parse(this.localStore)
    }

    const storeIndex = store.findIndex(obj => Object.keys(obj)[0] === name)
    if (storeIndex >= 0) {
      store[storeIndex][name] = value
    } else {
      let newObj = {}
      newObj[name] = value
      store.push(newObj)
    }

    this.updateStore(store)
  },

  updateStore: function (store) {
    localStorage.setItem(this.storageName, JSON.stringify(store))
    this.localStore = JSON.stringify(store)
  }
}

export default storage
