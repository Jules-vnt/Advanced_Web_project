<template>
  <div class="home">
    <!-- TODO: put adama.jpg in src/assets/, then uncomment -->
    <!-- <img alt="Vue logo" src="../assets/adama.jpg"> -->
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  }
}
</script>
