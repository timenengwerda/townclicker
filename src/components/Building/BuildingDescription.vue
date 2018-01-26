<template>
  <div class="building-description" v-html="description">
  </div>
</template>
<script>
export default {
  name: 'BuildingDescription',
  props: ['description']
}
</script>

