<template>
  <div class="building-holder" v-if="resource">
    <div class="building harvestable-building" @click="buildingClicked">
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
      <button class="btn btn-link btn-levelup" v-tooltip="{content: (!canLevelUp) ? 'Insufficient resources' : ''}" :disabled="!canLevelUp" @click.prevent="levelUp">
        <i class="fas fa-plus-circle"></i>
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
      notifications: []
    }
  },
  mounted () {
    this.resource = this.$store.getters.getResourceByName(this.name)
  },
  computed: {
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
          grain: Math.round(this.resource.baseCost.grain * (1.15 * this.resource.level)),
          wood: Math.round(this.resource.baseCost.wood * (1.15 * this.resource.level)),
          iron: Math.round(this.resource.baseCost.iron * (1.15 * this.resource.level))
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
    buildingClicked (e) {
      this.increaseResource(this.amountPerClick)
      this.increasePlayerExp(this.amountPerClick)
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
    levelUp (e) {
      if (this.currentGrain >= this.costToLevel.grain &&
          this.currentWood >= this.costToLevel.wood &&
          this.currentIron >= this.costToLevel.iron ) {
            this.levelUpResource({name: this.name, cost: {
              grain: this.costToLevel.grain,
              wood: this.costToLevel.wood,
              iron: this.costToLevel.iron
            }})

            this.increasePlayerExp(Math.round(Math.floor(this.resource.level * .9) + 50))
            this.addToLog('Building level up!')
      } else {
        this.addToLog('Insufficient resources for level up')
      }
    },
    ...mapActions({
      addToLog: 'addToLog',
      levelUpResource: 'levelUpResource',
      increaseResourceValue: 'increaseResourceValue',
      increasePlayerExp: 'increasePlayerExp'
    })
  }
}
</script>
