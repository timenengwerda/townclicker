<template>
  <div class="resource" v-if="resource" :title="resource.name">
      <i :class="fontAwesomeClass"></i>
      {{gainPerSecond | prettifyFixed }}/s <br>
      {{ resource.value | prettify }} - {{ capacity | prettify }}
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Resource',
  props: ['resource'],
  mounted () {
    this.storage = this.$store.getters.getStorageByName(`${this.resource.name}Storage`)
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
    capacity () {
      return this.$store.getters.getCapacity(this.resource.name)
    },
    gainPerSecond () {
      return this.$store.getters.gainPerSecond(this.resource.name)
    },
    ...mapGetters({
      totalWorkers: 'totalWorkers'
    })
  }
}
</script>
