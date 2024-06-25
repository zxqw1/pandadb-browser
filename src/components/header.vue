<template>
  <a-row>
    <a-col>
      <img src="../assets/img/logo.png" alt="">
      <div class="title">PandaDB Studio</div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
</script>

<style scoped>
.ant-row {
  height: 72px;
  width: 100%;
  border-bottom: 1px rgb(230, 230, 230) solid;
}
.title{
  color: rgb(108, 125, 46);
  font-size: 18px;
  font-weight: bolder;
  margin-left: 10px;
}
.ant-col{
  width: 100%;
  display: flex;
  align-items: center;
  background-color: rgb(255, 255, 255);

}
</style>