import storage from '../store/localStorage'
import _ from 'lodash'
const defaultObject = {
  value: 50, // current amount
  level: 0,
  type: 'harvestable',
  multiplier: 0,
  description: '',
  sprite: '/static/images/sprites/placeholder.png'
}

let grainObject = _.cloneDeepWith(defaultObject)
grainObject.name = 'grain'
grainObject.title = 'Farm'
grainObject.description = 'Increases food production per second <br> <small>A random building will be demoted every second if production per second is less than zero.</small>'
grainObject.baseCost = {
  grain: 31,
  wood: 37,
  iron: 38
}

let woodObject = _.cloneDeepWith(defaultObject)
woodObject.name = 'wood'
woodObject.title = 'Forest'
woodObject.description = 'Increases wood production per second'
woodObject.baseCost = {
  grain: 37,
  wood: 49,
  iron: 35
}
// What type needs what level to even start showing this building
woodObject.requirementBeforeShowing = [{
  type: 'grain',
  level: 1
}]

let ironObject = _.cloneDeepWith(defaultObject)
ironObject.name = 'iron'
ironObject.title = 'Iron mine'
ironObject.description = 'Increases iron production per second'
ironObject.baseCost = {
  grain: 40,
  wood: 38,
  iron: 50
}
// What type needs what level to even start showing this building
ironObject.requirementBeforeShowing = [{
  type: 'grain',
  level: 1
}]

let storageObject = null

// if there's storage for the resources, get its value, level and multiplier
// the rest of the data is static and doesnt have to be stored/getted
if (storage.get('grain')) {
  storageObject = JSON.parse(storage.get('grain'))
  grainObject.value = storageObject.value,
  grainObject.level = storageObject.level,
  grainObject.multiplier = storageObject.multiplier
}

if (storage.get('wood')) {
  storageObject = JSON.parse(storage.get('wood'))
  woodObject.value = storageObject.value,
  woodObject.level = storageObject.level,
  woodObject.multiplier = storageObject.multiplier
}

if (storage.get('iron')) {
  storageObject = JSON.parse(storage.get('iron'))
  ironObject.value = storageObject.value,
  ironObject.level = storageObject.level,
  ironObject.multiplier = storageObject.multiplier
}

export {
  grainObject,
  woodObject,
  ironObject
}
