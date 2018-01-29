<template>
  <div class="building-holder" :class="{'building-disabled' : !mayShowAndLevel}"v-if="resource">
    <div class="building storage-building">
      {{ resource.title }} - {{ resource.level }}
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
      <button class="btn btn-link btn-levelup" v-tooltip="{content: (!canLevelUp) ? 'Insufficient resources' : ''}" :disabled="!canLevelUp" @click.prevent="levelUp">
        <i class="fas fa-plus-circle"></i>
      </button>
      <button v-tooltip="{content: resource.description}" class="btn btn-link btn-tooltip"><i class="fas fa-question-circle"></i></button>
    </div>
  </div>
</template>
<script>

import { mapActions, mapGetters } from 'vuex'
import BuildingDescription from './BuildingDescription'
import VTooltip from 'v-tooltip'
export default {
  name: 'Building',
  props: ['name'],
  components: {
    BuildingDescription
  },
  data () {
    return {
      resource: false
    }
  },
  mounted () {
    this.resource = this.$store.getters.getResourceByName(this.name)
  },
  computed: {
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
      if (this.mayShowAndLevel) {
        if (this.currentGrain >= this.costToLevel.grain &&
            this.currentWood >= this.costToLevel.wood &&
            this.currentIron >= this.costToLevel.iron ) {
              return true
        }
      }

      return false
    },
    costToLevel () {
      return {
        grain: Math.round(this.resource.baseCost.grain * (1.25 * (this.resource.level + 1))),
        wood: Math.round(this.resource.baseCost.wood * (1.25 * (this.resource.level + 1))),
        iron: Math.round(this.resource.baseCost.iron * (1.25 * (this.resource.level + 1)))
      }
    }
  },
  methods: {
    levelUp () {
      if (this.currentGrain >= this.costToLevel.grain &&
          this.currentWood >= this.costToLevel.wood &&
          this.currentIron >= this.costToLevel.iron &&
          this.mayShowAndLevel) {
            this.levelUpResource({name: this.name, cost: {
              grain: this.costToLevel.grain,
              wood: this.costToLevel.wood,
              iron: this.costToLevel.iron
            }})

            this.increasePlayerExp(Math.round(Math.floor(this.resource.level * 1.1) + 60))

            this.setBonusForUser()
            this.addToLog('Building level up!')
      } else {
        this.addToLog('Insufficient resources for level up')
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
      increasePlayerExp: 'increasePlayerExp',
      multiplyAttack: 'multiplyAttack',
      multiplyDefense: 'multiplyDefense',
      increaseResourceMultiplier: 'increaseResourceMultiplier'
    })
  }
}
</script>

