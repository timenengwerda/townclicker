<template>
  <div class="navigation">
    <resource-overview :key="resource.name" :resource="resource" v-for="resource in harvestableResources"></resource-overview>
    <div class="workers" title="Workers">
      <i class="fas fa-users"></i> {{ totalWorkers | prettify }} (-{{ workerConsumption | prettifyFixed  }}/s)
    </div>
  </div>
</template>
<script>
import ResourceOverview from '@/components/Resource/Overview'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Navigation',
  components: {
    ResourceOverview
  },
  computed: {
    ...mapGetters({
      playerName: 'playerName',
      town: 'town',
      harvestableResources: 'harvestableResources',
      totalWorkers: 'totalWorkers',
      workerConsumption: 'workerConsumption'
    })
  },
  methods: {

  }
}
</script>

