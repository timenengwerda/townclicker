<template>
  <transition name="fade">
    <div class="mouse-notification" v-if="show" :style="stylePosOfMouse">
      {{ message }}
    </div>
  </transition>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'MouseNotification',
  props: ['staticXpos', 'staticYpos', 'message'],
  data () {
    return {
      show: false
    }
  },
  computed: {
    stylePosOfMouse () {
      const y = this.staticYpos - 90

      // give the X a nudge to the left or right according the a random 0 or 1
      const x = (Math.round(Math.random()) === 1) ? this.staticXpos + 20 : this.staticXpos - 20

      return `top: ${y}px; left: ${x}px;`
    }
  },
  mounted () {
    this.show = true

    setTimeout(() => {
      this.show = false
      this.$emit('destroy')
    }, 800)
  }
}
</script>
