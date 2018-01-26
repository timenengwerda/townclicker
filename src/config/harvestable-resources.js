import storage from '../store/localStorage'
import _ from 'lodash'
const defaultObject = {
  value: 2500, // current amount
  level: 3,
  type: 'harvestable',
  multiplier: 0,
  description: ''
}

let grainObject = _.cloneDeepWith(defaultObject)
grainObject.name = 'grain'
grainObject.title = 'Farm'
grainObject.description = 'Increases food production per second <br> <small>A random building will be demoted every second if production per second is less than zero.</small>'
grainObject.baseCost = {
  grain: 50,
  wood: 20,
  iron: 10
}

let woodObject = _.cloneDeepWith(defaultObject)
woodObject.name = 'wood'
woodObject.title = 'Forest'
woodObject.description = 'Increases wood production per second'
woodObject.baseCost = {
  grain: 30,
  wood: 70,
  iron: 40
}

let ironObject = _.cloneDeepWith(defaultObject)
ironObject.name = 'iron'
ironObject.title = 'Iron mine'
ironObject.description = 'Increases iron production per second'
ironObject.baseCost = {
  grain: 35,
  wood: 70,
  iron: 10
}

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
