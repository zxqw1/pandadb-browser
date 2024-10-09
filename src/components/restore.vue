<template>
    <div class="content" style="width: 100%; min-width: 50%; position: relative; z-index: 2;padding: 24px;">
        <el-row>
            <el-col style="display:flex;align-items: center;border-bottom: 1px dashed #999;padding-bottom: 10px;">
                <div style="width: 6px; height: 18px; background-color: rgb(108, 125, 46);"></div>
                <div style="font-size: 16px;color: #333;font-weight:bold;margin-left: 12px;">数据恢复</div>
            </el-col>
            <el-col>
                <div style="margin-top: 10px;">
                     <span
                        style="width: 13px;height: 13px;display: inline-block; background-color: rgb(108, 125, 46); border-radius: 50%;margin-right: 10px;"></span>
                    <span style="font-size: 15px; font-weight: bold;">备份恢复任务列表</span>   
                </div>
                <el-row>
                    <el-col style="margin-top: 10px;display: flex;    flex-direction: row-reverse;">
                        <el-button style="margin-left: 10px;" @click="dialogVisible = true">恢复</el-button>
                    </el-col>
                    <el-dialog v-model="dialogVisible" title="恢复备注" width="800">
                        <el-form :model="form" label-width="auto" style="max-width: 600px">
                            <el-form-item label="备注">
                                <el-input v-model="form.name" />
                            </el-form-item>
                           
                            <el-form-item >
                                <el-button style="background-color: rgb(108, 125, 46); color: #fff;">
                                    确定
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                    <el-col style="margin-top: 10px;">
                        <el-table :data="tableData" style="width: 100%" border>
                            <el-table-column type="selection" width="55" />
                            <el-table-column property="name" label="任务名称" width="120" />
                            <el-table-column property="time" label="备份恢复时间" width="240" show-overflow-tooltip />
                            <el-table-column property="type" label="恢复类型" />
                            <el-table-column property="schedule" label="进度" />
                            <el-table-column property="executionTime" label="执行时间" width="120" />
                            <el-table-column property="notes" label="备注" width="120" />
                        </el-table>
                    </el-col>
                    <el-col style="margin-top: 20px; display: flex; flex-direction: row-reverse;">
                        <el-pagination background layout="prev, pager, next" :total="1000" />
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { ref,reactive } from 'vue'
import { Search,Filter } from '@element-plus/icons-vue'
const dialogVisible = ref(false)
const form = reactive({
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: '',
})
const tableData = [
    {
        name: '***备份',
        time: '2024-9-19 14:45',
        type: '全量备份',
        executionTime: '1min',
        notes: '**备份',
        schedule:'50%'
    },
    {
        name: '***备份',
        time: '2024-9-19 14:45',
        type: '全量备份',
        executionTime: '1min',
        schedule:'50%',
        notes: '**备份'
    },
    {
        name: '***备份',
        time: '2024-9-19 14:45',
        type: '全量备份',
        executionTime: '1min',
        schedule:'50%',
        notes: '**备份'
    },
    {
        name: '***备份',
        time: '2024-9-19 14:45',
        type: '全量备份',
        executionTime: '1min',
        schedule:'50%',
        notes: '**备份'
    },
    {
        name: '***备份',
        time: '2024-9-19 14:45',
        type: '全量备份',
        executionTime: '1min',
        schedule:'50%',     
        notes: '**备份'
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