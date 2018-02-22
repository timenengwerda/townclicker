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

    setInterval(this.saveEntireGameState, 300000)

    this.checkIfGrainIsNegative()

    EventBus.$on('log', (msg) => {
      this.addToLog(msg)
    })

    this.setSecondTimers()
  },
  computed: {
    grainPerSecond () {
      return this.$store.getters.gainPerSecond('grain')
    },
    woodPerSecond () {
      return this.$store.getters.gainPerSecond('wood')
    },
    ironPerSecond () {
      return this.$store.getters.gainPerSecond('iron')
    },
    totalGrain () {
      return this.$store.getters.getResourceByName('grain').value
    },
    ...mapGetters({
      underAttack: 'underAttack',
      attackAmount: 'attackAmount',
      playerDef: 'def',
      lastAttack: 'lastAttack'
    })
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
    increaseResource (name, increaseBy) {
      this.increaseResourceValue({name, value: increaseBy})
    },
    setSecondTimers () {
      let secondsPassed = 0

      setInterval(() => {
        this.increaseResource('grain', this.grainPerSecond)
        this.increaseResource('wood', this.woodPerSecond)
        this.increaseResource('iron', this.ironPerSecond)

        // the playerDef should also be atleast 5(level 3-ish)
        if (this.playerDef > 5 ) {
          if (this.underAttack) {
            this.villageUnderAttack()
          } else {
            if (!this.lastAttack) {
              this.setLastAttack(Math.floor(Date.now() / 1000))
            }

            if (this.lastAttack > 0) {
              const lastAttackTime = Math.floor(Date.now() / 1000) - this.lastAttack
              // Only try to randomize an attack if the lastAttack was more than 600 seconds ago
              if (lastAttackTime > 600 && secondsPassed > 600) {
                secondsPassed = 0
                let randomized = Math.round(Math.random())
                if (randomized === 1 ) {
                  this.attackVillage()
                }
              } else {
                console.log('attack dodged!')
              }
            }
          }
        }

        secondsPassed++
      }, 1000)
    },
    getRandomInt (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    attackVillage () {
      this.setUnderAttack(true)
      const amountOfAttackers = this.getRandomInt(this.playerDef * 3, this.playerDef * 12)
      this.setAttackAmount(Math.round(amountOfAttackers))
    },
    villageUnderAttack () {
      // the hero kills *playerDef* of enemies every second
      this.setAttackAmount(Math.round(this.attackAmount - this.playerDef))
      if (this.attackAmount <= 0) {
        this.setUnderAttack(false)
        this.setAttackAmount(0)
        this.setLastAttack(Math.floor(Date.now() / 1000))
      }

      console.log('Enemy is killing')
      // the enemies destroy one resource every second (including grain!)
      this.delevelRandomResource(true)
    },
    ...mapActions({
      saveAllResourcesToLocalStorage: 'saveAllResourcesToLocalStorage',
      savePlayerToLocalStorage: 'savePlayerToLocalStorage',
      addToLog: 'addToLog',
      addNotification: 'addNotification',
      setMouseCoords: 'setMouseCoords',
      delevelRandomResource: 'delevelRandomResource',
      increaseResourceValue: 'increaseResourceValue',
      setUnderAttack: 'setUnderAttack',
      setAttackAmount: 'setAttackAmount',
      setLastAttack: 'setLastAttack'
    })
  }
}
</script>

