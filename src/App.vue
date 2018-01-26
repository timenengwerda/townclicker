<template>
  <div id="app">
    <user-new v-if="userIsNew"></user-new>
    <game v-else></game>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import UserNew from '@/components/User/New'
import Game from '@/components/Game/Game'

export default {
  name: 'app',
  components: {
    UserNew,
    Game
  },
  computed: {
    ...mapGetters({
      playerName: 'playerName',
      town: 'town',
    }),
    userIsNew () {
      if (this.playerName !== '' && this.town !== '') {
        return false
      }

      return true
    }
  }
}
</script>
