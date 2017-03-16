<template>
  <div id="app">
    <div class="container">
      <router-view transition="fade" transition-mode="out-in" keep-alive></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        enterActiveClass: 'animated fadeInRight'
      }
    },
    watch: {
      '$route' (to, from) {
        const toDepth = to.path.split('/').length
        const fromDepth = from.path.split('/').length
        if (toDepth > fromDepth) {
          this.enterActiveClass = 'animated fadeInRight'
        } else {
          this.enterActiveClass = 'animated fadeInLeft'
        }
      }
    }
  }
</script>

<style>
    @import './assets/css/common.css';
   .theirs[v-cloak] {
      display: none;
    }
    .fade-transition {
      transition: opacity .3s ease;
    }
    .fade-enter, .fade-leave {
      opacity: 0;
    }
</style>
