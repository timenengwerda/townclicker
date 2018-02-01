<template>
  <div class="resource-field">
      <building name="grain"></building>
      <building name="wood"></building>
      <building name="iron"></building>
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

export default {
  name: 'ResourceField',
  components: {
    Building
  }
}
</script>
