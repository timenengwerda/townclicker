<template>
  <div class="resource-field">
      <building-harvestable name="grain"></building-harvestable>
      <building-harvestable name="wood"></building-harvestable>
      <building-harvestable name="iron"></building-harvestable>
      <building name="grainStorage"></building>
      <building name="woodStorage"></building>
      <building name="ironStorage"></building>
      <building name="grainMultiply"></building>
      <building name="woodMultiply"></building>
      <building name="ironMultiply"></building>
      <building name="defenseMultiply"></building>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Building from '@/components/Building/Building'
import BuildingHarvestable from '@/components/Building/Harvestable'

export default {
  name: 'ResourceField',
  components: {
    Building,
    BuildingHarvestable
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
    }
  },
  mounted () {
    this.setSecondTimers()
  },
  methods: {
    setSecondTimers () {
      setInterval(() => {
        this.increaseResource('grain', this.grainPerSecond)
        this.increaseResource('wood', this.woodPerSecond)
        this.increaseResource('iron', this.ironPerSecond)
      }, 1000)
    },
    increaseResource (name, increaseBy) {
      this.increaseResourceValue({name, value: increaseBy})
    },
    ...mapActions({
      increaseResourceValue: 'increaseResourceValue'
    })
  }
}
</script>
