<template>
  <div class="content" style="width: 100%; min-width: 50%; position: relative; z-index: 2;padding: 24px;">
  <el-row>
    <el-col style="display:flex;align-items: center;border-bottom: 1px dashed #999;padding-bottom: 10px;">
                <div style="width: 6px; height: 18px; background-color: rgb(108, 125, 46);"></div>
                <div style="font-size: 16px;color: #333;font-weight:bold;margin-left: 12px;">阈值信息配置</div>
            </el-col>
    <el-col style="margin-top: 10px;">
                <div style="margin-top: 10px;">
                    <span
                        style="width: 13px;height: 13px;display: inline-block; background-color: rgb(108, 125, 46); border-radius: 50%;margin-right: 10px;"></span>
                    <span style="font-size: 15px; font-weight: bold;">阈值信息配置</span>
                </div>
                <el-row>
                    <el-col style="margin-top: 10px; display: flex; justify-content: space-between;">
                        <el-input v-model="input1" style="max-width: 600px" placeholder="请输入关键字"
                            class="input-with-select">
                            <template #append>
                                <el-button :icon="Search" />
                            </template>
                        </el-input>
                        <div>
                            <el-button >新增</el-button>
                            <el-button>保存</el-button>
                        </div>
                    </el-col>   
                    <el-col style="margin-top: 10px;">
                        <el-table :data="tableData" style="width: 100%" border>
                            <el-table-column fixed prop="number" label="序号"  />
                            <el-table-column prop="name" label="告警项"  />
                            <el-table-column prop="threshold" label="阈值"  />
                            <el-table-column prop="frequency" label="告警频率(ms)" />
                            <el-table-column prop="method" label="发送方式" />
                            <el-table-column prop="address" label="告警地址 "  />
                            <el-table-column prop="state" label="状态（启用、未启用） " />
                            <el-table-column prop="content" label="告警内容 "  />
                            <el-table-column prop="notes" label="备注"  />
                        </el-table>
                    </el-col>
                </el-row>
            </el-col>
            <el-col style="margin-top: 20px; display: flex; flex-direction: row-reverse;">
                        <el-pagination background layout="prev, pager, next" :total="1000" />
                    </el-col>
  </el-row>
  </div>
</template>

<script setup lang="ts">
import { Search, Filter } from '@element-plus/icons-vue'
const tableData = [
    {
        number: '1',
        name: '内存溢出',
        threshold: '200T',
        frequency: '3',
        method: 'email',
        address: '123456@163.com',
        state: '已启用',
        content: '内存过载',
        notes: '由于****待解决'
    },
    {
        number: '2',
        name: '内存溢出',
        threshold: '200T',
        frequency: '3',
        method: 'email',
        address: '123456@163.com',
        state: '已启用',
        content: '内存过载',
        notes: '由于****待解决'
    },
    {
        number: '3',
        name: '内存溢出',
        threshold: '200T',
        frequency: '3',
        method: 'email',
        address: '123456@163.com',
        state: '已启用',
        content: '内存过载',
        notes: '由于****待解决'
    },
    {
        number: '4',
        name: '内存溢出',
        threshold: '200T',
        frequency: '3',
        method: 'email',
        address: '123456@163.com',
        state: '已启用',
        content: '内存过载',
        notes: '由于****待解决'
    },
    {
        number: '5',
        name: '内存溢出',
        threshold: '200T',
        frequency: '3',
        method: 'email',
        address: '123456@163.com',
        state: '已启用',
        content: '内存过载',
        notes: '由于****待解决'
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
</style>