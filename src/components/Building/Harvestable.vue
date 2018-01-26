<template>
  <div class="building-holder" v-if="resource">
    <div class="building harvestable-building" @click="buildingClicked">
      <i :class="fontAwesomeClass"></i> {{ resource.title }} - {{ resource.level }}
      <building-description :description="resource.description"></building-description>
    </div>
    <button :disabled="!canLevelUp" @click.prevent="levelUp">Level up g: {{ costToLevel.grain }} w: {{ costToLevel.wood }} i: {{ costToLevel.iron }}</button>

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
import BuildingDescription from './BuildingDescription'

export default {
  name: 'BuildingHarvestable',
  props: ['name'],
  components: {
    MouseNotification,
    BuildingDescription
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
      return {
        grain: Math.round(this.resource.baseCost.grain * (1.25 * (this.resource.level + 1))),
        wood: Math.round(this.resource.baseCost.wood * (1.25 * (this.resource.level + 1))),
        iron: Math.round(this.resource.baseCost.iron * (1.25 * (this.resource.level + 1)))
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
    levelUp () {
      if (this.currentGrain >= this.costToLevel.grain &&
          this.currentWood >= this.costToLevel.wood &&
          this.currentIron >= this.costToLevel.iron ) {
            this.levelUpResource({name: this.name, cost: {
              grain: this.costToLevel.grain,
              wood: this.costToLevel.wood,
              iron: this.costToLevel.iron
            }})

            this.increasePlayerExp(Math.round(Math.floor(this.resource.level * .9) + 50))
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

