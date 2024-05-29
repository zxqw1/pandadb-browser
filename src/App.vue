
<template >
  <RouterView />
</template>

<script setup lang="ts">
import request from "./utils/request.js"
//  request.fetchData('neo4j', 'bigdata')
  // console.log(request.fetchData('neo4j', 'bigdata','MATCH (n) RETURN n LIMIT 10'),9)
// fetchData('neo4j', 'bigdata')
</script>
<style scoped>
</style>