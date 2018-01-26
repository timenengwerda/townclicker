import storage from '../localStorage'
import _ from 'lodash'
import {grainObject, woodObject, ironObject} from '@/config/harvestable-resources'
import {grainStorage, woodStorage, ironStorage} from '@/config/storage-resources'
import {grainMultiply, woodMultiply, ironMultiply, defenseMultiply} from '@/config/multiplying-resources'

const state = {
  resources: [
    grainObject,
    woodObject,
    ironObject,
    grainStorage,
    woodStorage,
    ironStorage,
    woodMultiply,
    ironMultiply,
    defenseMultiply,
    grainMultiply, // always keep grainMultiply as last so we cant delevel it when the grain runs out
  ]
}

const increaseCostOfResource = function (context, resource, resourceName) {
  // increase the cost of the next level
  const newGrainCost = Math.round(resource.baseCost['grain'] * (1.35 * resource.level))
  const newWoodCost = Math.round(resource.baseCost['wood'] * (1.35 * resource.level))
  const newIronCost = Math.round(resource.baseCost['iron'] * (1.35 * resource.level))

  context.commit('SET_RESOURCE_COST', {name: resourceName, cost: {
    grain: newGrainCost,
    wood: newWoodCost,
    iron: newIronCost
  }})
}

// actions
const actions = {
  delevelRandomResource (context) {
    // get a random number and get the resource it goes with
    const randomResourceIndex = Math.floor(Math.random() * (state.resources.length - 1)) + 1
    const resourceToDelevel = state.resources[randomResourceIndex]

    // if the randomly selected resource is already level 1, the player is lucky; nothing will happen this tick
    if (resourceToDelevel && resourceToDelevel.level > 1) {
      context.commit('SET_RESOURCE_LEVEL', {resource: resourceToDelevel, name: resourceToDelevel.name, level: (resourceToDelevel.level - 1)})
    }
  },
  increaseResourceValue (context, dto) {
    const resource = state.resources.find(resource => resource.name === dto.name)
    const storage = state.resources.find(resource => resource.name === `${dto.name}Storage`)
    const storageCapacity = getStorageCapacityByLevel(storage.level)
    const newValue = (resource.value + dto.value)
    // if the new value is lower than capacity, add it to the store
    if (storageCapacity >= newValue) {
      context.commit('SET_RESOURCE_VALUE', {name: dto.name, value: newValue})
    } else {
      context.commit('SET_RESOURCE_VALUE', {name: dto.name, value: storageCapacity})
    }
  },
  increaseResourceMultiplier (context, dto) {
    const resourceToAddMultiplierTo = state.resources.find(resource => resource.name === dto.name)
    if (resourceToAddMultiplierTo) {
      context.commit('SET_RESOURCE_MULTIPLIER_PERCENTAGE', {
        name: dto.name,
        multiplier: (resourceToAddMultiplierTo.multiplier + dto.multiplier)
      })
    }
  },
  levelUpResource (context, dto) {
    const resource = state.resources.find(resource => resource.name === dto.name)
    context.commit('SET_RESOURCE_LEVEL', {resource, name: dto.name, level: (resource.level + 1)})

    // decrease all the resource values
    const grainResource = state.resources.find(resource => resource.name === 'grain')
    const woodResource = state.resources.find(resource => resource.name === 'wood')
    const ironResource = state.resources.find(resource => resource.name === 'iron')

    context.commit('SET_RESOURCE_VALUE', {name: 'grain', value: grainResource.value - dto.cost.grain})
    context.commit('SET_RESOURCE_VALUE', {name: 'wood', value: woodResource.value - dto.cost.wood})
    context.commit('SET_RESOURCE_VALUE', {name: 'iron', value: ironResource.value - dto.cost.iron})
  },
  saveAllResourcesToLocalStorage(context, dto) {
    context.commit('SAVE_RESOURCES_TO_LOCAL_STORAGE', _.cloneDeepWith(state.resources))
  }
}

// mutations
const mutations = {
  SET_RESOURCE_VALUE (state, dto) {
    const indexOfResource = state.resources.findIndex(resource => resource.name === dto.name)
    state.resources[indexOfResource].value = dto.value
  },
  SET_RESOURCE_MULTIPLIER_PERCENTAGE (state, dto) {
    const indexOfResource = state.resources.findIndex(resource => resource.name === dto.name)
    state.resources[indexOfResource].multiplier = dto.multiplier
  },
  SET_RESOURCE_LEVEL (state, dto) {
    dto.resource.level = dto.level
  },
  SAVE_RESOURCES_TO_LOCAL_STORAGE (state, dto) {
    dto.forEach(resource => {
      // store only the level and (if needed) the multiplier and value.
      // the rest we can extract from the resource itself(Such as basecost etc)
      const stuffToStore = {
        level: resource.level
      }
      if (resource.multiplier !== null) {
        stuffToStore.multiplier = resource.multiplier
      }

      if (resource.value) {
        stuffToStore.value = resource.value
      }

      storage.set(resource.name, JSON.stringify(stuffToStore))
    })
  }
}

function totalWorkersConsumption(workers) {
  return workers / 5
}

function getStorageCapacityByLevel (level) {
  return (level + 1) * 1000
}

// getters
const getters = {
  resources: state => state.resources,
  getResourceByName: (state, getters) => (name) => {
    return state.resources.find(resource => resource.name === name)
  },
  getAmountPerClick: (state, getters) => (name) => {
    const resource = state.resources.find(resource => resource.name === name)
    const base = (resource.level < 1) ? 1 : 0
    return Math.ceil(.35 * resource.level) + base
  },
  getStorageByName: (state, getters) => (name) => {
    return state.resources.find(resource => resource.name === name)
  },
  getCapacity: (state, getters) => (name) => {
    const building = state.resources.find(resource => resource.name === `${name}Storage`)
    return getStorageCapacityByLevel(building.level) // increase capacity by 500 per level
  },
  harvestableResources: state => {
    return state.resources.filter(r => r.type === 'harvestable')
  },
  gainPerSecond: (state, getters) => (resourceName) => {
    const resource = state.resources.filter(r => r.name === resourceName)

    let perSecond = 0
    if (resource) {
      // console.log(resource[0].level, resource[0].multiplier)
      perSecond = resource[0].level * ((resource[0].multiplier + 100) / 100)
      if (resourceName === 'grain') {
        const totalWorkers = state.resources.reduce((prevVal, resource) => {
            return prevVal + resource.level;
        }, 0)
        perSecond -= totalWorkersConsumption(totalWorkers)
      }
    }

    return perSecond
  },
  totalWorkers: state => {
    return state.resources.reduce((prevVal, resource) => {
        return prevVal + resource.level;
    }, 0)
  },
  workerConsumption: state => {
    const totalWorkers = state.resources.reduce((prevVal, resource) => {
        return prevVal + resource.level;
    }, 0)

    return totalWorkersConsumption(totalWorkers)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
