<template>
  <div class="player">
    {{ playerName }} - {{ level }} <br>
    <div title="Defense">
      <i class="fas fa-shield"></i> {{ def }}
    </div>
    <div title="Attack">
      <i class="fas fa-bolt"></i> {{ atk }}
    </div>
    <exp-bar></exp-bar>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import ExpBar from './ExpBar'

export default {
  name: 'Player',
  components: {
    ExpBar
  },
  computed: {
    ...mapGetters({
      playerName: 'playerName',
      town: 'town',
      level: 'level',
      exp: 'exp',
      def: 'def',
      atk: 'atk',
    })
  },
  methods: {

  }
}
</script>
