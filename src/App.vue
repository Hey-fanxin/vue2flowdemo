<template>
  <div id="app">
    <FlowTool />
  </div>
</template>

<script>
import FlowTool from './components/FlowTool'

export default {
  name: 'App',
  components: {
    FlowTool
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100vw;
  height: 100vh;
}
</style>
