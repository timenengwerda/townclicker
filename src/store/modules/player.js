import storage from '../localStorage'
import EventBus from '@/eventbus'

const expMultiplier = 1000

// initial state
const state = {
  name: storage.get('name'),
  town: storage.get('town'),
  exp: (!storage.get('exp')) ? 0 : storage.get('exp'),
  level: (!storage.get('level')) ? 1 : storage.get('level'),
  atk: 3,
  def: 3,
  atkMultiplier: (!storage.get('atkMultiplier')) ? 0 : storage.get('atkMultiplier'),
  defMultiplier: (!storage.get('defMultiplier')) ? 0 : storage.get('defMultiplier')
}
// actions
const actions = {
  saveName (context, dto) {
    context.commit('SET_NAME', dto)
  },
  saveTown (context, dto) {
    context.commit('SET_TOWN', dto)
  },
  savePlayerToLocalStorage (context, dto) {
    context.commit('SAVE_PLAYER_TO_LOCAL_STORAGE', dto)
  },
  multiplyAttack (context, percentage) {
    context.commit('SET_ATK_MULTIPLIER', state.atkMultiplier + percentage)
  },
  multiplyDefense (context, percentage) {
    context.commit('SET_DEF_MULTIPLIER', state.defMultiplier + percentage)
  },
  increasePlayerExp (context, dto) {
    const newExp = state.exp + dto
    const expNeeded = state.level * expMultiplier // same as the getter below
    if (newExp >= expNeeded) {
      EventBus.$emit('log', 'Level up!')
      context.commit('SET_LEVEL', state.level + 1)
      context.commit('SET_EXP', (newExp - expNeeded))
      // context.commit('SET_ATK', (state.atk + state.level))
      // context.commit('SET_DEF', (state.def + state.level))
    } else {
      context.commit('SET_EXP', newExp)
    }
  }
}

// mutations
const mutations = {
  SET_NAME (state, dto) {
    state.name = dto
  },
  SET_LEVEL (state, dto) {
    state.level = dto
  },
  SET_EXP (state, dto) {
    state.exp = dto
  },
  SET_TOWN (state, dto) {
    state.town = dto
  },
  SET_ATK_MULTIPLIER (state, dto) {
    state.atkMultiplier = dto
  },
  SET_DEF_MULTIPLIER (state, dto) {
    state.defMultiplier = dto
  },
  SAVE_PLAYER_TO_LOCAL_STORAGE (state, dto) {
    storage.set('name', state.name)
    storage.set('town', state.town)
    storage.set('exp', state.exp)
    storage.set('level', state.level)
    storage.set('atkMultiplier', state.atkMultiplier)
    storage.set('defMultiplier', state.defMultiplier)
  }
}

// getters
const getters = {
  playerName: state => state.name,
  town: state => state.town,
  exp: state => state.exp,
  level: state => state.level,
  def: state => ((state.def + state.level) + ((state.def + state.level) * (state.defMultiplier / 100))),
  atk: state => ((state.atk + state.level)+ ((state.atk + state.level)* (state.atkMultiplier / 100))),
  expNeeded: state => {
    return state.level * expMultiplier
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
