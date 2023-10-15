<template>
  <div id="app">
    <!-- <FlowTool /> -->
    <FlowView />
  </div>
</template>

<script>
// import FlowTool from './components/FlowTool'
import FlowView from './components/FlowView'
export default {
  name: 'App',
  components: {
    // FlowTool,
    FlowView
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
