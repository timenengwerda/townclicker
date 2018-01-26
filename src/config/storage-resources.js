import storage from '../store/localStorage'
import _ from 'lodash'
// initial state
const storageObject = {
  level: 3,
  type: 'storage'
}

let grainStorage = _.cloneDeepWith(storageObject)
grainStorage.name = 'grainStorage'
grainStorage.title = 'Grain Silo'
grainStorage.baseCost = {
  grain: 240,
  wood: 170,
  iron: 140
}
// What type needs what level to even start showing this building
grainStorage.requirementBeforeShowing = [{
  type: 'grain',
  level: 3
}]
grainStorage.description = 'Increases food maximum capacity'

let ironStorage = _.cloneDeepWith(storageObject)
ironStorage.name = 'ironStorage'
ironStorage.title = 'Ore silo'
ironStorage.baseCost = {
  grain: 120,
  wood: 170,
  iron: 190
}
// What type needs what level to even start showing this building
ironStorage.requirementBeforeShowing = [{
  type: 'iron',
  level: 3
}]
ironStorage.description = 'Increases iron maximum capacity'

let woodStorage = _.cloneDeepWith(storageObject)
woodStorage.name = 'woodStorage'
woodStorage.title = 'Wood pile'
woodStorage.baseCost = {
  grain: 130,
  wood: 210,
  iron: 140
}
woodStorage.description = 'Increases wood maximum capacity'
// What type needs what level to even start showing this building
woodStorage.requirementBeforeShowing = [{
  type: 'wood',
  level: 3
}]


let str = null
if (storage.get('grainStorage')) {
  str = JSON.parse(storage.get('grainStorage'))
  grainStorage.level = str.level
}

if (storage.get('woodStorage')) {
  str = JSON.parse(storage.get('woodStorage'))
  woodStorage.level = str.level
}

if (storage.get('ironStorage')) {
  str = JSON.parse(storage.get('ironStorage'))
  ironStorage.level = str.level
}

export {
  grainStorage,
  woodStorage,
  ironStorage
}
