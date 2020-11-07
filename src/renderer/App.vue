<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'mr-referee-desktop'
  }
</script>

<style>
  @import "~bootstrap/dist/css/bootstrap.css";
  @import "~bootstrap-vue/dist/bootstrap-vue.css";
  /* CSS */
  .page-enter-active, .page-leave-active {
    transition: opacity 1s, transform 1s;
  }
  .page-enter, .page-leave-to {
    opacity: 0;
    transform: translateX(-30%);
  }

</style>
