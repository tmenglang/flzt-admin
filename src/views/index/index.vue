<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎光临！{{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Index',
  created() {
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  
  mounted () {
    if (!localStorage.getItem('reflash')) {
      localStorage.setItem('reflash', 1);
      window.location.reload();
    } else {
      this.$router.push({path: '/dashboard' + localStorage.getItem('redirect')});
    }
  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
