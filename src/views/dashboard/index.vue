<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <iframe class="ifa" scrolling=auto src="https://datav.aliyuncs.com/share/9df6d81f81be0eb28010ed22980c1750" frameborder="0"></iframe>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
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
