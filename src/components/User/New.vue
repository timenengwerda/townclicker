<template>
  <div class="user">
    <user-form @submit="save"></user-form>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import UserForm from './Form'
export default {
  name: 'UserNew',
  components: {
    UserForm
  },
  methods: {
    save (data) {
      this.saveTown(data.town)
      this.saveName(data.name)
    },
    ...mapActions({
      saveTown: 'saveTown',
      saveName: 'saveName'
    })
  }
}
</script>

