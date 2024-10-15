<template>
    <div class="content" style="width: 100%; min-width: 50%; position: relative; z-index: 2;padding: 24px;">
        <el-row>
            <el-col style="margin-bottom: 20px;">
                <el-row>
                    <el-col :span="6">
                        <div style="margin-top: 10px;">
                            <div>
                                <span class="demonstration">节点：</span>
                                <el-select v-model="databaseNodeValue" placeholder="请选择" style="width: 240px "
                                    @change="nodeChange">
                                    <el-option v-for="(item, index) in databaseoption" :value="item.value">{{ item.description}}</el-option>
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
            <el-col style="display:flex;align-items: center;border-bottom: 1px dashed #999;padding-bottom: 10px;">
                <div style="width: 6px; height: 18px; background-color: rgb(108, 125, 46);"></div>
                <div style="font-size: 16px;color: #333;font-weight:bold;margin-left: 12px;">总览</div>
                <!-- <el-tag style="margin-left: 10px;" effect="dark" :type="'danger'">2条告警</el-tag> -->
            </el-col>
            <el-col style="margin-top: 24px; width: 100%;">
                <el-descriptions :column="2">
                    <el-descriptions-item label="数据库状态：">
                        <el-tag size="small">{{ nodeStatus }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="服务已启动：">{{ runTime }}</el-descriptions-item>
                </el-descriptions>
            </el-col>
            <el-col
                style="display:flex;align-items: center;border-bottom: 1px dashed #999;padding-bottom: 10px;margin-top: 24px;">
                <div style="width: 6px; height: 18px; background-color: rgb(108, 125, 46);"></div>
                <div style="font-size: 16px;color: #333;font-weight:bold;margin-left: 12px;">图表</div>
            </el-col>
            <el-col style="margin-top: 20px; position: relative;">
                <el-select v-model="timeValue" placeholder="最近一小时" size="large" style="width: 240px"
                    @change="timeChange">
                    <el-option v-for="item in options" :key="item.value" :label="item.description" :value="item.value" />
                </el-select>
                <el-row style="margin-top: 10px;">
                    <el-col :span="12">
                        <div>
                            <span
                                style="width: 13px;height: 13px;display: inline-block; background-color: rgb(108, 125, 46); border-radius: 50%;margin-right: 10px;"></span>
                            <span style="font-size: 15px; font-weight: bold;">读取速率变化</span>
                        </div>
                        <div id="category" style="height: 400px;"></div>
                    </el-col>
                    <el-col :span="12">
                        <div>
                            <span
                                style="width: 13px;height: 13px;display: inline-block; background-color: rgb(108, 125, 46); border-radius: 50%;margin-right: 10px;"></span>
                            <span style="font-size: 15px; font-weight: bold;">写入速率变化</span>
                        </div>
                        <div id="category2" style="height: 400px;"></div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, onMounted, nextTick } from "vue";
import mitts from '../utils/bus';
import getManageInfo from "../utils/manageRequest"
const timeValue = ref('')
const databaseNodeValue = ref('')
const databaseoption = ref([])
const nodeStatus = ref("")
const runTime = ref("")
const options = ref([])
let url = window.localStorage.getItem("address")//地址
function replaceOrAddUrlPath(ipWithMaybePath, newPath) {
    // 检查IP地址中是否包含'/'（除了最后一个字符可能是':'的情况）  
    // 这里假设IP地址格式正确，并且':'只出现在端口号之前  
    const hasPath = ipWithMaybePath.includes('/') && !ipWithMaybePath.endsWith(':');
    if (hasPath) {
        // 如果包含路径，则替换最后一个'/'及其后面的所有内容  
        return ipWithMaybePath.replace(/\/[^\/]*$/, `${newPath}`);
    } else {
        // 如果没有路径，则直接添加新路径  
        return `${ipWithMaybePath}/${newPath}`;
    }
}
const generateRandomId = () => {
    const timestamp = new Date().getTime(); // 获取当前时间戳
    const randomNum = Math.floor(Math.random() * 1000); // 生成一个0-999之间的随机数
    return `id_${timestamp}_${randomNum}`; // 返回拼接后的ID字符串
};
onMounted(async () => { // 初始化图表
    //数据库节点状态枚举
    const databaseUrl = replaceOrAddUrlPath(url,'/databaseStatusTypeList')
    const databasequery = {
        "queryId":generateRandomId()
    }
    const databaseNodeData = await getManageInfo(databaseUrl, "GET",JSON.stringify(databasequery))
    databaseoption.value = databaseNodeData.response
    //图表时间段枚举
    const databaseperiodUrl = replaceOrAddUrlPath(url,'/database/period')
    options.value = await getManageInfo(databaseperiodUrl,'GET')
    // 数据库节点运行情况
    const databaseRunquery = {
        "nodeIp": url.slice(url.indexOf('//')+2, url.lastIndexOf(':')),
        "period": options.value[0]
    }
    const databaseRunData = await getManageInfo(databaseperiodUrl, "GET",JSON.stringify(databaseRunquery))
    console.log(databaseRunData, '106')
    nodeStatus.value = databaseRunData.response.nodeStatus
    runTime.value = databaseRunData.response.runTime
    var myChart = echarts.init(window.document.getElementById("category"));
    var myChart2 = echarts.init(window.document.getElementById("category2"));
    let readSpeedData = {
        grid: {
            left: '0%', // 图表距离容器左侧的距离
            right: '4%', // 图表距离容器右侧的距离
            top: '10px', // 图表距离容器上部的距离
            bottom: '40px', // 图表距离容器底部的距离
            containLabel: true // 确保标签在grid内显示
        },
        xAxis: {
            type: 'category',
            data: databaseRunData.response.readSpeedData.x
        },
        yAxis: {
            type: 'value',
            data: databaseRunData.response.readSpeedData.y
        },
        series: [
            {
                data: [0.5, 1],
                type: 'line',
                smooth: true
            }
        ]
    }
    myChart.setOption(readSpeedData);
    let writeSpeedData = {
        grid: {
            left: '0%', // 图表距离容器左侧的距离
            right: '4%', // 图表距离容器右侧的距离
            top: '10px', // 图表距离容器上部的距离
            bottom: '40px', // 图表距离容器底部的距离
            containLabel: true // 确保标签在grid内显示
        },
        xAxis: {
            type: 'category',
            data: databaseRunData.response.writeSpeedData.x
        },
        yAxis: {
            type: 'value',
            data: databaseRunData.response.writeSpeedData.y
        },
        series: [
            {
                data: [0.5, 1],
                type: 'line',
                smooth: true
            }
        ]
    }
    myChart2.setOption(writeSpeedData);
})
//节点
const nodeChange = async() => {
    const databaseDetailUrl = replaceOrAddUrlPath(url, '/database/detail')
    const databaseRunquery = {
        "nodeIp": url.slice(url.indexOf('//')+2, url.lastIndexOf(':')),
        "period": options.value[0]
    }
    const databaseRunData = await getManageInfo(databaseDetailUrl, "GET",JSON.stringify(databaseRunquery))
    console.log(databaseRunData, '106')
    nodeStatus.value = databaseRunData.response.nodeStatus
    runTime.value = databaseRunData.response.runTime
    var myChart = echarts.init(window.document.getElementById("category"));
    var myChart2 = echarts.init(window.document.getElementById("category2"));
    let readSpeedData = {
        grid: {
            left: '0%', // 图表距离容器左侧的距离
            right: '4%', // 图表距离容器右侧的距离
            top: '10px', // 图表距离容器上部的距离
            bottom: '40px', // 图表距离容器底部的距离
            containLabel: true // 确保标签在grid内显示
        },
        xAxis: {
            type: 'category',
            data: databaseRunData.response.readSpeedData.x
        },
        yAxis: {
            type: 'value',
            data: databaseRunData.response.readSpeedData.y
        },
        series: [
            {
                data: [0.5, 1],
                type: 'line',
                smooth: true
            }
        ]
    }
    myChart.setOption(readSpeedData);
    let writeSpeedData = {
        grid: {
            left: '0%', // 图表距离容器左侧的距离
            right: '4%', // 图表距离容器右侧的距离
            top: '10px', // 图表距离容器上部的距离
            bottom: '40px', // 图表距离容器底部的距离
            containLabel: true // 确保标签在grid内显示
        },
        xAxis: {
            type: 'category',
            data: databaseRunData.response.writeSpeedData.x
        },
        yAxis: {
            type: 'value',
            data: databaseRunData.response.writeSpeedData.y
        },
        series: [
            {
                data: [0.5, 1],
                type: 'line',
                smooth: true
            }
        ]
    }
    myChart2.setOption(writeSpeedData);
}
// 时间
const timeChange = async () => {
    const databaseDetailUrl = replaceOrAddUrlPath(url, '/database/detail')
    const databaseRunquery = {
        "nodeIp": url.slice(url.indexOf('//')+2, url.lastIndexOf(':')),
        "period": timeValue.value
    }
    const databaseRunData = await getManageInfo(databaseDetailUrl, "GET",JSON.stringify(databaseRunquery))
    console.log(databaseRunData, '106')
    nodeStatus.value = databaseRunData.response.nodeStatus
    runTime.value = databaseRunData.response.runTime
    var myChart = echarts.init(window.document.getElementById("category"));
    var myChart2 = echarts.init(window.document.getElementById("category2"));
    let readSpeedData = {
        grid: {
            left: '0%', // 图表距离容器左侧的距离
            right: '4%', // 图表距离容器右侧的距离
            top: '10px', // 图表距离容器上部的距离
            bottom: '40px', // 图表距离容器底部的距离
            containLabel: true // 确保标签在grid内显示
        },
        xAxis: {
            type: 'category',
            data: databaseRunData.response.readSpeedData.x
        },
        yAxis: {
            type: 'value',
            data: databaseRunData.response.readSpeedData.y
        },
        series: [
            {
                data: [0.5, 1],
                type: 'line',
                smooth: true
            }
        ]
    }
    myChart.setOption(readSpeedData);
    let writeSpeedData = {
        grid: {
            left: '0%', // 图表距离容器左侧的距离
            right: '4%', // 图表距离容器右侧的距离
            top: '10px', // 图表距离容器上部的距离
            bottom: '40px', // 图表距离容器底部的距离
            containLabel: true // 确保标签在grid内显示
        },
        xAxis: {
            type: 'category',
            data: databaseRunData.response.writeSpeedData.x
        },
        yAxis: {
            type: 'value',
            data: databaseRunData.response.writeSpeedData.y
        },
        series: [
            {
                data: [0.5, 1],
                type: 'line',
                smooth: true
            }
        ]
    }
    myChart2.setOption(writeSpeedData);
}
mitts.on("resize", () => { // 这个是 点击了 数据库运行情况 执行的，也是为啥刷新图表
    nextTick(() => {
        var myChart = echarts.init(window.document.getElementById("category"));
        var myChart2 = echarts.init(window.document.getElementById("category2"));
        myChart.resize();
        myChart2.resize();
    })
})
window.addEventListener('resize', function () { // 这个是浏览器改变宽度，监听的，会刷新 图表
    var myChart = echarts.init(window.document.getElementById("category"));
    var myChart2 = echarts.init(window.document.getElementById("category2"));
    myChart.resize();
    myChart2.resize();
});
</script>

<style scoped>
.content {
    margin: 24px;
    background-color: #ffffff;
    width: 100%;
}
</style>