import storage from '../store/localStorage'
import _ from 'lodash'
import { grainObject } from './harvestable-resources';
// initial state
const multiplyObject = {
  level: 0,
  type: 'multiply'
}

let grainMultiply = _.cloneDeepWith(multiplyObject)
grainMultiply.name = 'grainMultiply'
grainMultiply.title = 'Mill'

// the bonus multipliers that are gained by leveling this building
grainMultiply.multipliers = [
  {
    percentage: 6,
    resourceToMultiply: 'Grain',
    resourceNameToMultiply: 'grain'
  }
]
grainMultiply.baseCost = {
  grain: 670,
  wood: 480,
  iron: 540
}
// What type needs what level to even start showing this building
grainMultiply.requirementBeforeShowing = [{
  type: 'grainStorage',
  level: 2
}]
grainMultiply.description = 'Increases food bonus production by 6%'

let ironMultiply = _.cloneDeepWith(multiplyObject)
ironMultiply.name = 'ironMultiply'
ironMultiply.title = 'Blacksmith'
ironMultiply.multipliers = [
  {
    percentage: 5,
    resourceToMultiply: 'Hero Attack',
    resourceNameToMultiply: 'atk'
  },
  {
    percentage: 3,
    resourceToMultiply: 'Iron',
    resourceNameToMultiply: 'iron'
  }
]
ironMultiply.description = 'Increases iron bonus production by 3%<br>Increases hero attack bonus by 5%'
ironMultiply.baseCost = {
  grain: 400,
  wood: 650,
  iron: 780
}
// What type needs what level to even start showing this building
ironMultiply.requirementBeforeShowing = [{
  type: 'ironStorage',
  level: 2
}]

let woodMultiply = _.cloneDeepWith(multiplyObject)
woodMultiply.name = 'woodMultiply'
woodMultiply.title = 'Carpenter'
woodMultiply.multipliers = [
  {
    percentage: 3,
    resourceToMultiply: 'Wood',
    resourceNameToMultiply: 'wood'
  }
]
woodMultiply.description = 'Increases wood bonus production by 3%'
woodMultiply.baseCost = {
  grain: 400,
  wood: 800,
  iron: 620
}
// What type needs what level to even start showing this building
woodMultiply.requirementBeforeShowing = [{
  type: 'woodStorage',
  level: 2
}]

let defenseMultiply = _.cloneDeepWith(multiplyObject)
defenseMultiply.name = 'defenseMultiply'
defenseMultiply.title = 'City wall'
defenseMultiply.multipliers = [
  {
    percentage: 5,
    resourceToMultiply: 'Hero Defense',
    resourceNameToMultiply: 'def'
  }
]
defenseMultiply.description = 'Increases Hero defense bonus by 5%'
defenseMultiply.baseCost = {
  grain: 100,
  wood: 725,
  iron: 860
}
// What type needs what level to even start showing this building
defenseMultiply.requirementBeforeShowing = [{
  type: 'iron',
  level: 2
}, {
  type: 'wood',
  level: 2
}, {
  type: 'grain',
  level: 2
}]

let storageObject = null
// get the level from the storage if there's storage
if (storage.get('grainMultiply')) {
  storageObject = JSON.parse(storage.get('grainMultiply'))
  grainMultiply.level = storageObject.level
}

if (storage.get('woodMultiply')) {
  storageObject = JSON.parse(storage.get('woodMultiply'))
  woodMultiply.level = storageObject.level
}

if (storage.get('ironMultiply')) {
  storageObject = JSON.parse(storage.get('ironMultiply'))
  ironMultiply.level = storageObject.level
}

if (storage.get('defenseMultiply')) {
  storageObject = JSON.parse(storage.get('defenseMultiply'))
  defenseMultiply.level = storageObject.level
}

export {
  grainMultiply,
  woodMultiply,
  ironMultiply,
  defenseMultiply
}
