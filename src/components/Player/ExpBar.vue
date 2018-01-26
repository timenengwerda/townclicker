<template>
  <div class="player">
    {{ exp }} - {{ expNeeded }}
    <div class="exp-bar">
      <div class="bar-filled" :style="{width: expPercentage}"></div>
      <span class="percentage">{{ expPercentage }}</span>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ExpBar',
  computed: {
    expPercentage () {
      let xp = (this.exp / this.expNeeded) * 100
      xp = xp.toFixed(1)
      if (xp.toString().indexOf('.0') > 0) {
        return `${parseInt(xp).toFixed(0)}%`
      }

      return `${xp}%`
    },
    ...mapGetters({
      level: 'level',
      exp: 'exp',
      expNeeded: 'expNeeded'
    })
  },
  methods: {

  }
}
</script>
