<template>
  <div class="title" >
    <div class="titleS">
      <div class="icon"></div>
      <span style="font-size: 20px; color: #333333; font-weight: 600"
        >设置</span
      >
    </div>
    <!-- 内容 -->
    <a-row
      v-for="(item, index) in setterList"
      :key="index"
      style="display: flex; flex-direction: column"
    >
      <a-col class="setter" style="display: flex; align-items: center">
        <div class="circle"></div>
        <div class="name">{{ item.title }}</div>
      </a-col>
      <!-- 主题 -->
      <!-- <a-col v-if="item.type === 'theme'" style="margin: 14px 0;">
        <a-radio-group v-model:value="value" name="radioGroup">
          <a-radio value="1">浅色</a-radio>
          <a-radio value="2">深色</a-radio>
        </a-radio-group>
      </a-col> -->
      <!-- 默认初始命令 -->
      <a-col v-if="item.type === 'favor'">
        <!-- <div>
          <h4 style="margin-left: 5px;">默认初始命令</h4>
            <a-input v-model:value="value2" placeholder="默认命令" style="margin-top: 6px;" />
        </div> -->
        <!-- <div>
          <h4 style="margin-left: 5px;">连接超时时间</h4>
            <a-input v-model:value="value3" placeholder="时间" style="margin-top: 6px;" />
        </div> -->
      </a-col>
      <a-col v-if="item.type === 'result'">
        <div>
          <h4 style="margin-left: 5px;">默认节点大小</h4>
            <a-input v-model:value="value4" placeholder="大小" style="margin-top: 6px;" />
        </div>
        <div>
          <h4 style="margin-left: 5px;">历史记录最大条数</h4>
            <a-input v-model:value="value5" placeholder="时间" style="margin-top: 6px;" />
        </div>
      </a-col>
    </a-row>
    <!-- <el-button type="primary" style="width: 100%; margin-top: 30px;" @click="setterClick">确定</el-button> -->
  </div>
</template>

<script setup lang="ts">
import setterList from "../../data/setter";
import { ref,watch } from "vue";
const value = ref<string>("1");
const value2 = ref<string>('');
const value3 = ref<string>('');
const value4 = ref<string>('');
const value5 = ref<string>('');

// const setterClick = ()=>{
//   //默认节点大小
//   window.localStorage.setItem("size",value4.value)
//   //历史记录最大条数
//   window.localStorage.setItem('item',value5.value)
// }

</script>

<style scoped>
.title {
  margin: 18px 26px;
}
.titleS {
  display: flex;
  align-items: center;
}
.ant-radio-checked {
  background-color: #6a8322 !important; /* 例如: #FF0000 */
  border-color: #6a8322 !important;
}
</style>