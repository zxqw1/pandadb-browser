<template>
  <div class="help" tyle="margin: 18px 26px">
    <!--标题 -->
    <div class="titleS">
      <div class="icon"></div>
      <span style="font-size: 20px; color: #333333; font-weight: 600">帮助</span>
    </div>
    <!-- 反馈意见 -->
    <el-button plain @click="open" style="margin-top: 18px"
      >点击反馈意见</el-button
    >
    <!-- 内容 -->
    <a-row v-for="(item, index) in help" :key="index">
      <div style="display: flex; flex-direction: column">
        <a-col class="help1">
          <div class="circle"></div>
          <div class="name">{{ item.title }}</div>
        </a-col>
        <a-col style="display: flex; flex-direction: column">
          <a
            href=""
            v-if="item.type === 'show'"
            v-for="(item1, index1) in item.data"
            :key="index1"
            style="color: #6a8322"
            >{{ item1 }}</a
          >
        </a-col>
        <a-col style="display: flex; flex-direction: column">
          <a
            href=""
            v-if="item.type === 'document'"
            v-for="(item2, index2) in item.data"
            :key="index2"
            style="color: #6a8322"
            >{{ item2 }}</a
          >
        </a-col>
      </div>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import help from "../../data/help";
import { ElMessage, ElMessageBox } from "element-plus";

const open = () => {
  ElMessageBox.prompt("请输入你的意见", "意见箱", {
    confirmButtonText: "发送",
    cancelButtonText: "取消",
    inputPattern:
      /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    inputErrorMessage: "您输入的不符合规则",
  })
    .then(({ value }) => {
      ElMessage({
        type: "success",
        message: `请输入你的意见:${value}`,
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "您已取消",
      });
    });
};
</script>
<style scoped>
.help1 {
  margin-top: 30px;
  display: flex;
  align-items: center;
}
.help {
  margin: 18px 26px;
}
.titleS {
  display: flex;
  align-items: center;
}
.icon {
  width: 4px;
  height: 20px;
  background-color: #6a8322;
  border-radius: 5px;
  margin-right: 10px;
}
.el-button:hover {
  color: #6a8322;
  border: #6a8322 1px solid;
}
</style>
