<template>
    <div class="content" style="width: 100%; min-width: 50%; position: relative; z-index: 2;padding: 24px;">
      <el-row>
        <el-col style="display:flex;align-items: center;border-bottom: 1px dashed #999;padding-bottom: 10px;">
          <div style="width: 6px; height: 18px; background-color: rgb(108, 125, 46);"></div>
          <div style="font-size: 16px;color: #333;font-weight:bold;margin-left: 12px;">操作记录</div>
        </el-col>
        <el-col style="margin-top: 10px;">
          <div style="margin-top: 10px;">
            <span
              style="width: 13px;height: 13px;display: inline-block; background-color: rgb(108, 125, 46); border-radius: 50%;margin-right: 10px;"></span>
            <span style="font-size: 15px; font-weight: bold;">筛选</span>
          </div> 
            <el-row>
              <el-col :span="6">
                <div style="margin-top: 10px;">
                  <div>
                    <span class="demonstration">操作时间：</span>
                    <el-date-picker v-model="value1" type="datetime" placeholder="时间选择" />
                  </div>
                </div>
              </el-col>
              <el-col :span="6">
                <div style="margin-top: 10px;">
                  <div>
                    <span class="demonstration">操作类型：</span>
                    <el-select v-model="value" placeholder="Select" style="width: 240px">
                      <el-option label="类型1" />
                    </el-select>
                  </div>
                </div>
              </el-col>
            </el-row>
        </el-col>
        <el-col style="margin-top: 10px;">
          <div style="margin-bottom: 10px;">
            <span
              style="width: 13px;height: 13px;display: inline-block; background-color: rgb(108, 125, 46); border-radius: 50%;margin-right: 10px;"></span>
            <span style="font-size: 15px; font-weight: bold;">日志</span>
          </div>
          <el-table :data="tableData" style="width: 100%;">
            <el-table-column fixed prop="date" label="操作时间" />
            <el-table-column prop="name" label="用户名" />
            <el-table-column prop="state" label="操作类型" />
            <el-table-column prop="city" label="操作内容" />
          </el-table>
        </el-col>
        <el-col style="margin-top: 20px; display: flex; flex-direction: row-reverse;">
          <el-pagination background layout="prev, pager, next" :total="1000" />
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Search } from "@element-plus/icons-vue";
  import { ref } from 'vue'
  const value1 = ref('')
  const value = ref('')
  const tableData = [
    {
      date: '2024-9-19 14:45',
      name: 'admin',
      state: '查询',
      city: 'MATCH(n:Univergity) RETURN N LIMIT 25',
    },
    {
      date: '2024-9-20 14:45',
      name: 'admin',
      state: '查询',
      city: 'MATCH(n:Univergity) RETURN N LIMIT 26',
    },
    {
      date: '2024-9-21 14:45',
      name: 'admin',
      state: '查询',
      city: 'MATCH(n:Univergity) RETURN N LIMIT 27',
    },
    {
      date: '2024-9-22 14:45',
      name: 'admin',
      state: '查询',
      city: 'MATCH(n:Univergity) RETURN N LIMIT 28',
    },
    {
      date: '2024-9-23 14:45',
      name: 'admin',
      state: '查询',
      city: 'MATCH(n:Univergity) RETURN N LIMIT 29',
    },
  ]
  </script>
  
  <style scoped>
  .content {
    margin: 24px;
    background-color: #ffffff;
    width: 100%;
  }
  
  .el-pager.is-active {
    background-color: rgb(108, 125, 46);
  }
  
  ::v-deep .is-checked .el-checkbox__inner {
    background: #6C7D2E !important;
    border: 1px solid #6C7D2E !important;
  }
  
  ::v-deep .el-pager .is-active {
    background: #6C7D2E !important;
  }
  
  .demonstration {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 20px;
  }
  </style>