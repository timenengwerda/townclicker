<template>
  <div class="game">
    <navigation></navigation>
    <div class="row game-holder">
      <div class="col-8">
        <resource-field></resource-field>
      </div>
      <div class="col-4">
        <player></player>
        <log></log>
        <button @click.prevent="saveEntireGameState('Manual save')">Save</button>
      </div>
    </div>
  </div>
</template>
<script>
import EventBus from '@/eventbus'
import { mapActions, mapGetters } from 'vuex'
import Navigation from '@/components/Navigation'
import Log from '@/components/Log'
import Player from '@/components/Player/Player'
import ResourceField from '@/components/Resource/Field'

export default {
  name: 'Game',
  components: {
    Navigation,
    Log,
    Player,
    ResourceField
  },
  data () {
    return {
      delevelingInterval: null
    }
  },
  mounted () {
    this.saveEntireGameState()
    setInterval(this.saveEntireGameState, 60000)
    this.checkIfGrainIsNegative()
    EventBus.$on('log', (msg) => {
      this.addToLog(msg)
    })
  },
  computed: {
    grainPerSecond () {
      return this.$store.getters.gainPerSecond('grain')
    },
    totalGrain () {
      return this.$store.getters.getResourceByName('grain').value
    }
  },
  watch: {
    grainPerSecond (a) {
      this.checkIfGrainIsNegative()
    },
    totalGrain (a) {
      this.checkIfGrainIsNegative()
    }
  },
  methods: {
    checkIfGrainIsNegative () {
      if (this.grainPerSecond < 0 && this.totalGrain < 0) {
        if (this.delevelingInterval === null) {
          console.log('kill')
          // de-level random resource (except for grain itself) every second until the grainproduction is atleast 0 again
          this.delevelingInterval = setInterval(() => {
            this.delevelRandomResource()
          }, 1000)
        }
      } else {
        clearInterval(this.delevelingInterval)
        this.delevelingInterval = null
      }
    },
    saveEntireGameState(saveMessage = '') {
      // resources
      this.saveAllResourcesToLocalStorage()
      this.savePlayerToLocalStorage()

      if (saveMessage === '') {
        this.addToLog('Autosaved')
      } else {
        this.addToLog(saveMessage)
      }
    },
    ...mapActions({
      saveAllResourcesToLocalStorage: 'saveAllResourcesToLocalStorage',
      savePlayerToLocalStorage: 'savePlayerToLocalStorage',
      addToLog: 'addToLog',
      addNotification: 'addNotification',
      setMouseCoords: 'setMouseCoords',
      delevelRandomResource: 'delevelRandomResource'
    })
  }
}
</script>

