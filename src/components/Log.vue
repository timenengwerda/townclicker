<template>
  <div class="log" v-if="log.length">
    <li class="logItem" v-for="logItem in reversedLogs">
      {{ logItem }}
    </li>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Log',
  computed: {
    reversedLogs () {
      return this.log.slice().reverse()
    },
    ...mapGetters({
      log: 'log'
    })
  }
}
</script>

