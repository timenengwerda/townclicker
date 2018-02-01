<template>
  <div class="building-holder" v-if="resource && mayShowAndLevel">
    <div class="building" :class="buildingClass">
      <div @click="buildingClicked">
        <img :src="resource.sprite">
        <i :class="fontAwesomeClass"></i> {{ resource.title }} - {{ resource.level }}
        <ul>
          <li>
            <i class="fab fa-pagelines"></i> {{ costToLevel.grain }}
          </li>
          <li>
            <i class="fas fa-tree"></i> {{ costToLevel.wood }}
          </li>
          <li>
            <i class="fas fa-cubes"></i> {{ costToLevel.iron }}
          </li>
        </ul>
      </div>
      <button class="btn btn-link btn-levelup" v-tooltip="{content: (!canLevelUp) ? 'Insufficient resources' : ''}" :disabled="!canLevelUp" @click.prevent="levelUp">
        <i class="fas fa-plus-circle"></i>
      </button>
      <button class="btn btn-link" v-tooltip="{content: 'Level up max.'}" :disabled="!canLevelUp" @click.prevent="levelUpMax">
        <i class="fas fa-plus-circle"></i>
        Max ({{maxLevelsToUpdate}})
      </button>
      <button v-tooltip="{content: resource.description}" class="btn btn-link btn-tooltip"><i class="fas fa-question-circle"></i></button>
    </div>

    <mouse-notification
      :staticXpos="n.x"
      :staticYpos="n.y"
      :message="n.message"
      :key="index"
      v-for="(n, index) in notifications">
    </mouse-notification>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import EventBus from '@/eventbus'
import MouseNotification from '@/components/Notifications/MouseNotification'

export default {
  name: 'BuildingHarvestable',
  props: ['name'],
  components: {
    MouseNotification
  },
  data () {
    return {
      resource: false,
      notifications: [],
      resourceMultiplier: 1.45
    }
  },
  mounted () {
    this.resource = this.$store.getters.getResourceByName(this.name)
  },
  computed: {
    buildingClass () {
      return `${this.resource.type}-building`
    },
    mayShowAndLevel () {
      let mayPass = true // assume its safe to pass unless one of the checks in the each below fails

      if (this.resource.requirementBeforeShowing) {
        this.resource.requirementBeforeShowing.forEach(req => {
          const resourceByType = this.$store.getters.getResourceByName(req.type)
          // if the resource is not found, or the resource is found but the level is lower than the required level; it may not pass
          if (!resourceByType || (resourceByType && req.level > resourceByType.level)) {
            mayPass = false
          }
        })
      }
      return mayPass
    },
    maxLevelsToUpdate () {
      if (!this.canLevelUp) {
        return 0
      }
      let maxLevels = 0
      let counter = 1
      let canStillLevel = true

      // keep track of the resources that will be detracted with every loop
      let simulatedCurrentGrain = this.currentGrain
      let simulatedCurrentIron = this.currentIron
      let simulatedCurrentWood = this.currentWood

      while (canStillLevel) {
        const nextLevel = parseInt(this.resource.level -1) + counter

        // calculate what the resource cost would be for the nextLevel resource
        const grainForNextLevel = this.getResourceCostForLevel('grain', nextLevel)
        const ironForNextLevel = this.getResourceCostForLevel('iron', nextLevel)
        const woodForNextLevel = this.getResourceCostForLevel('wood', nextLevel)

        // check if that new resource cost is still enough to level up once
        const canLevel = this.canLevelUpToLevel({
          grain: simulatedCurrentGrain,
          wood: simulatedCurrentWood,
          iron: simulatedCurrentIron,
        }, {
          grain: grainForNextLevel,
          iron: ironForNextLevel,
          wood: woodForNextLevel
        })

        // decrease the simulated resources because every level costs you so the simulated resource will decrease with every level
        simulatedCurrentGrain = simulatedCurrentGrain - grainForNextLevel
        simulatedCurrentWood = simulatedCurrentWood - woodForNextLevel
        simulatedCurrentIron = simulatedCurrentIron - ironForNextLevel

        // if we can still level up, increase the MaxLevels counter,
        // otherwise stop the loop
        if (canLevel) {
          maxLevels++
        } else {
          canStillLevel = false
        }

        counter++
      }

      return maxLevels
    },
    fontAwesomeClass () {
      switch (this.resource.name) {
        case 'iron':
          return 'fas fa-cubes'
          break
        case 'wood':
          return 'fas fa-tree'
          break
        case 'grain':
          return 'fab fa-pagelines'
          break
      }

      return ''
    },
    currentGrain () {
      return this.$store.getters.getResourceByName('grain').value
    },
    currentWood () {
      return this.$store.getters.getResourceByName('wood').value
    },
    currentIron () {
      return this.$store.getters.getResourceByName('iron').value
    },
    amountPerClick () {
      return this.$store.getters.getAmountPerClick(this.name)
    },
    canLevelUp () {
      if (this.currentGrain >= this.costToLevel.grain &&
          this.currentWood >= this.costToLevel.wood &&
          this.currentIron >= this.costToLevel.iron ) {
            return true
      }

      return false
    },
    costToLevel () {
      if (this.resource.level >= 1) {
        return {
          grain: Math.round(this.resource.baseCost.grain * (this.resourceMultiplier * this.resource.level)),
          wood: Math.round(this.resource.baseCost.wood * (this.resourceMultiplier * this.resource.level)),
          iron: Math.round(this.resource.baseCost.iron * (this.resourceMultiplier * this.resource.level))
        }
      }

      return {
        grain: Math.round(this.resource.baseCost.grain),
        wood: Math.round(this.resource.baseCost.wood),
        iron: Math.round(this.resource.baseCost.iron)
      }
    }
  },
  methods: {
    canLevelUpToLevel(currentResources, costToLevel) {
      if (currentResources.grain >= costToLevel.grain &&
          currentResources.wood >= costToLevel.wood &&
          currentResources.iron >= costToLevel.iron ) {
            return true
      }

      return false
    },
    getResourceCostForLevel (r, level) {
      return this.resource.baseCost[r] * (this.resourceMultiplier * level)
    },
    buildingClicked (e) {
      this.increaseResource(this.amountPerClick)
      this.increasePlayerExp(Math.round(this.amountPerClick / 2))
      this.notifications.push({
        x: e.clientX,
        y: e.clientY,
        message: `+${this.amountPerClick}`
      })

      // destroy the notification after a second because we dont need it that long
      setTimeout(() => {
        this.notifications.splice(0, 1)
      }, 1000)
    },
    increaseResource (increaseBy) {
      this.increaseResourceValue({name: this.name, value: increaseBy})
    },
    levelUp (e, isRecursive = false, callback) {
      if (this.currentGrain >= this.costToLevel.grain &&
          this.currentWood >= this.costToLevel.wood &&
          this.currentIron >= this.costToLevel.iron ) {
            this.levelUpResource({name: this.name, cost: {
              grain: this.costToLevel.grain,
              wood: this.costToLevel.wood,
              iron: this.costToLevel.iron
            }})

            this.increasePlayerExp(Math.round(Math.floor(this.resource.level * .9) + 50))

            if (this.resource.type === 'multiply') {
              this.setBonusForUser()
            }

            if (!isRecursive) {
              this.addToLog('Building level up!')
            } else {
              if (callback) {
                callback(true)
              }
            }
      } else {
        this.addToLog('Insufficient resources for level up')
      }
    },
    levelUpMax (e) {
      // run this method recursively aslong as this.levelUp method returns true
      // let the levelup method return a callback when it's saved properly
      // if there is a callback; run this method again.
      if (this.canLevelUp) {
        this.levelUp(e, true, (r) => {
          if (r) {
            this.levelUpMax(e)
          }
        })
      }
    },
    setBonusForUser () {
      if (this.resource.multipliers) {
        this.resource.multipliers.forEach(multiplier => {
          if (multiplier.resourceNameToMultiply === 'wood' || multiplier.resourceNameToMultiply === 'grain' || multiplier.resourceNameToMultiply === 'iron') {
            this.increaseResourceMultiplier({
              name: multiplier.resourceNameToMultiply,
              multiplier: multiplier.percentage
            })
          }

          if (multiplier.resourceNameToMultiply === 'atk') {
            this.multiplyAttack(multiplier.percentage)
          }

          if (multiplier.resourceNameToMultiply === 'def') {
            this.multiplyDefense(multiplier.percentage)
          }
        })
      }
    },
    ...mapActions({
      addToLog: 'addToLog',
      levelUpResource: 'levelUpResource',
      increaseResourceValue: 'increaseResourceValue',
      increasePlayerExp: 'increasePlayerExp',
      multiplyAttack: 'multiplyAttack',
      multiplyDefense: 'multiplyDefense',
      increaseResourceMultiplier: 'increaseResourceMultiplier'
    })
  }
}
</script>
