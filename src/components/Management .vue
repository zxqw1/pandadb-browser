<template>
  <div class="content" style="width: 100%; min-width: 50%; position: relative; z-index: 2;padding: 24px;">
    <el-row>
      <el-col style="display:flex;align-items: center;border-bottom: 1px dashed #999;padding-bottom: 10px;">
        <div style="width: 6px; height: 18px; background-color: rgb(108, 125, 46);"></div>
        <div style="font-size: 16px;color: #333;font-weight:bold;margin-left: 12px;">作业管理</div>
      </el-col>
      <el-col>
        <el-row>
          <el-col style="margin-top: 10px; display: flex; justify-content: space-between;">
            <el-input v-model="input1" style="max-width: 600px" placeholder="请输入关键字" class="input-with-select">
              <template #append>
                <el-button :icon="Search" />
              </template>
            </el-input>
            <div>
              <el-button>新增</el-button>
              <el-button>保存</el-button>
            </div>
          </el-col>
          <el-col style="margin-top: 10px;">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="date" label="Date" width="180" />
            <el-table-column prop="name" label="Name" width="180" />
            <el-table-column prop="address" label="Address" />
          </el-table>
        </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
const input1 = ref('')
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>

<style scoped>
.content {
  margin: 24px;
  background-color: #ffffff;
  width: 100%;
}
</style>