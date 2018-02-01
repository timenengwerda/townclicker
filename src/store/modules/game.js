import storage from '../localStorage'

// initial state
const state = {
  underAttack: false,
  lastAttack: storage.get('lastAttack') ? storage.get('lastAttack') : 0,
  attackAmount: 0
}
// actions
const actions = {
  setLastAttack (context, dto) {
    context.commit('SET_LAST_ATTACK', dto)
  },
  setUnderAttack (context, dto) {
    context.commit('SET_UNDER_ATTACK', dto)
  },
  setAttackAmount (context, dto) {
    context.commit('SET_ATTACK_AMOUNT', dto)
  }
}

// mutations
const mutations = {
  SET_LAST_ATTACK (state, dto) {
    state.lastAttack = dto
    storage.set('lastAttack', dto)
  },
  SET_UNDER_ATTACK (state, dto) {
    state.underAttack = dto
  },
  SET_ATTACK_AMOUNT (state, dto) {
    state.attackAmount = dto
  }
}

// getters
const getters = {
  lastAttack: state => state.lastAttack,
  underAttack: state => state.underAttack,
  attackAmount: state => state.attackAmount,
}

export default {
  state,
  getters,
  actions,
  mutations
}
