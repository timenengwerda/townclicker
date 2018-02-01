<template>
  <div class="user">
    <form @submit.prevent="submitted">
      <div class="form-group">
        <label>Name</label>
        <input type="text" v-model="newName">
      </div>
      <div class="form-group">
        <label>Townsname</label>
        <input type="text" v-model="newTown">
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>
<script>
export default {
  name: 'UserNew',
  props: ['name', 'town'],
  data () {
    return {
      newName: (this.name) ? this.name : '',
      newTown: (this.town) ? this.town : ''
    }
  },
  methods: {
    submitted () {
      this.$emit('submit', {name: this.newName, town: this.newTown})
    }
  }
}
</script>

