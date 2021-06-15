<template>
  <div>
    <h2>我爱你赵丽颖</h2>
    <Child></Child>
  </div>
</template>

<script>
import Child from '@/views/product/sku/Child'
export default {
  name: 'Sku',
  components:{
    Child
  }
}
</script>

<style scoped>
div >>> h2{
  color:hotpink
}
</style>
