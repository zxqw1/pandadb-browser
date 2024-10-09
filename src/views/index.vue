<template>
  <div style="overflow: hidden;">
  <a-row>
    <!-- 顶部 -->
    <a-col :span="24">
      <headerNav></headerNav>
    </a-col>
    <!-- 顶部 -->
    <a-col :span="24">
      <!-- 左面导航 -->
      <a-col :span="24" style="display: flex;justify-content: space-between;">
        <LeftMenu></LeftMenu>
        <RightContent v-show="menuKey === 'home'"></RightContent>
        <!-- 操作日志 -->
        <OperationLog v-show="menuKey === 'OperationLog'"></OperationLog>
        <!-- 运行日志 -->
        <RunLog v-show="menuKey === 'RunLog'"></RunLog>
         <!-- 数据库运行情况 -->
        <Database v-show="menuKey === 'Database'"></Database>
        <!-- 系统运行情况 -->
         <OperatingSystem v-show="menuKey === 'OperatingSystem'"></OperatingSystem>
         <!--告警记录  -->
         <Alarm v-show="menuKey === 'alarm'"></Alarm>
         <!-- 阈值配置 -->
        <Threshold v-show="menuKey === 'threshold'"></Threshold>
         <!-- 统计信息 -->
          <Statistics v-show="menuKey === 'statistics'"></Statistics>
          <!-- 在线备份 -->
          <onlineBackup v-show="menuKey === 'onlineBackup'"></onlineBackup>
          <!-- 数据恢复 -->
           <Restore v-show="menuKey === 'restore'"></Restore>
           <!-- 登录日志 -->
          <loginLog v-show="menuKey === 'loginLog'"></loginLog>
          <!-- 操作记录 -->
          <OperationRecord v-show="menuKey === 'OperationRecord'"></OperationRecord>
          <!-- 作业管理 -->
          <Management v-show="menuKey === 'management'"></Management>
      </a-col>
    </a-col>
  </a-row>

  </div>
</template>

<script setup lang="ts">
import { ElMessageBox } from "element-plus";
import headerNav from "../components/header.vue";
import LeftMenu from "../components/menu.vue";
import RightContent from "../components/rightcontent.vue";
import OperationLog from "@/components/OperationLog.vue";
import RunLog from "@/components/RunLog.vue";
import Database from "@/components/database.vue";
import OperatingSystem from "@/components/OperatingSystem.vue";
import Alarm from "@/components/alarm.vue"
import Statistics from "@/components/statistics.vue";
import onlineBackup from "@/components/onlineBackup.vue";
import Restore from "@/components/restore.vue";
import loginLog from "@/components/loginLog.vue";
import OperationRecord from "@/components/OperationRecord.vue";
import Threshold from "@/components/threshold.vue";
import Management from "@/components/Management .vue";
import { onMounted, ref } from "vue";
import mitts from "../utils/bus";
let menuKey = ref("home")
mitts.on('menuEmit',(data)=>{
  menuKey.value = data
  mitts.emit("resize")
}) 
</script>

<style scoped>
.ant-row {
  background-color: rgb(246, 246, 246);
  height: 100%;
}
.ant-col:nth-child(2) {
  /* display: flex; */
}
</style>
<style>
.el-button--primary{
  background-color: #6a8322;
  border: 1px solid #6a8322 ;
}
.el-button--primary:hover{
  background-color: #6a8322;
  border: none;
}
</style>