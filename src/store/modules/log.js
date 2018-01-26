import moment from 'moment'

// initial state
const state = {
 log: []
}
// actions
const actions = {
  addToLog (context, dto) {
    context.commit('ADD_TO_LOG', dto)
    setTimeout(() => {
      context.commit('SHIFT_FROM_LOG')
    }, 3000)
  }
}

// mutations
const mutations = {
  ADD_TO_LOG (state, dto) {
    state.log.push(`${dto} - ${moment().format('HH:mm:ss')}`)
  },
  SHIFT_FROM_LOG (state) {
    state.log.shift()
  }
}

// getters
const getters = {
  log: state => state.log
}

export default {
  state,
  getters,
  actions,
  mutations
}
