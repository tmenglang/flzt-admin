<template>
  <div class="dashboard-container">
    <iframe class="ifa" scrolling=auto src="https://datav.aliyuncs.com/share/5f9ea07979bd2240fca93ce1ba8614e9" frameborder="0"></iframe>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Realtime',
  created() {
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  
  mounted () {

  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 0;
    height: calc(100vh - 50px);
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.ifa{
  width:100%;
  height:100%;
}
</style>
