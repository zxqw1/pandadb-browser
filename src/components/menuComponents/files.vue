<template>
    <div style="padding: 18px 26px">
        <div class="titleS">
            <div class="icon"></div>
            <span style="font-size: 20px; color: #333333; font-weight: 600">文件</span>
        </div>
        <el-row>
            <el-col>
                <el-button type="primary" style="width: 100%;margin-top: 30px;" @click="addFiles">新建文件夹</el-button>
            </el-col>
        </el-row>
        <el-tree style="margin-top: 14px;" v-if="fileTreedata.length" :data="fileTreedata" node-key="id" draggable
            :allow-drag="allowDrop"  @node-drop="handleDrop">
            <template #default="scoped">
                <el-row style="width: 100%;padding-right: 6px">
                    <el-col :span="22">
                        <span @dblclick="renameClick(scoped)" v-if="!scoped.data.show">{{ scoped.data.label }}</span>
                        <el-input v-else id="myInput" v-model="scoped.data.label" @blur="handleEnter(scoped)"></el-input>
                        <!-- <span>{{ scoped.data.isFile }}</span> -->
                    </el-col>
                    <el-col :span="2" v-if="!scoped.data.isFile">
                        <el-popover placement="bottom" :width="200" trigger="hover">
                            <div style="cursor: pointer;" @click="newFolderClick(scoped)">New Folder</div>
                            <div style="cursor: pointer;"> Upload File</div>
                            <div style="cursor: pointer;"> Rename</div>
                            <div style="cursor: pointer;"> Delete Folder</div>
                            <template #reference>
                                <el-icon size="14">
                                    <More />
                                </el-icon>
                            </template>
                        </el-popover>
                    </el-col>
                </el-row>
            </template>
        </el-tree>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { More } from '@element-plus/icons-vue'
import getManageInfo from "../../utils/manageRequest"
import { ElMessage } from 'element-plus'
const fileTreedata = ref([])
const name = ref("")
const newname = ref("")
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
//获取树形结构
const obtainTree = async () => {
    const treeUrl = replaceOrAddUrlPath(url, '/file/folderTree')
    const treeData = await getManageInfo("https://apifoxmock.com/m1/5219875-4886398-default/file/folderTree", "GET")
    fileTreedata.value = treeData.response
}
onMounted(async () => {
    //获取树形结构
    await obtainTree()
    console.log(fileTreedata.value, '59')
})
//新建文件夹
const addFiles = async() => {
    fileTreedata.value.push({
        "id":generateRandomId(),
        "isFile" :false,
        "label": "新建文件夹",
        "show" :true,
        "new":true
    })
}
//重命名
const renameClick = (scoped) => {
    scoped.data.show = true
    console.log(scoped.data.label,'90')
    name.value = scoped.data.label
    nextTick(() => {
        document.getElementById("myInput").focus();
    })
}
//重命名失去焦点
const handleEnter = async(scoped)=>{
    scoped.data.show = false
   if(scoped.data.new){
    //新建文件夹
    const fileuploadUrl = replaceOrAddUrlPath(url, '/file/upload')
    const fileuploadquery = {
        testFile:"",
        fileName:scoped.data.label
    }
     await getManageInfo(fileuploadUrl, "POST",JSON.stringify(fileuploadquery))
     await obtainTree()
   }else{
    //重命名
    // newname.value = scoped.data.label
    // const filePath = 
    // const renameUrl = replaceOrAddUrlPath(url, '/file/rename')
    // const renameQuery = {
    //     fileName:name.value
    // }
   }
   console.log(scoped,'114')
}
// //拖拽
// const handleDrop = (draggingNode,dropNode, type,event)=>{
//     console.log()
//     if(hasParent(dropNode) === false){
       
//     }else{
//         ElMessage('This is a message')

//         return
//     }
//     // console.log(hasParent(dropNode),'121')
//     // hasParent(dropNode)
//     // if(hasParent)
// }
const allowDrop = (draggingNode,dropNode,type)=>{
    console.log(hasParent(dropNode),'134')
    return true
    // if(hasParent(dropNode) === false){
    //     return true
    // }else{
    //     ElMessage('节点层级限制为2')
    //     return false
    // }
}
//判断树形结构是否有父节点
const hasParent = (node)=>{
    console.log(node,'145')
    if(node.parent === null && node.parent === undefined){
        return false
    }else{
        return true
    }
    // if(node.parent.parent !== null && node.parent.parent !== undefined){
    //     return false
    // } else{
    //     return true
    // }
}
</script>

<style scoped></style>