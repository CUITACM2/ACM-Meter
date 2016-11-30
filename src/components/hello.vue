<template>
  <h1>
    Hi {{ message }}
  </h1>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      message: 'Vue.js 2'
    }
  }
}
</script>

<style lang="less">
h1 {
  color: #ff6443;
}
</style>