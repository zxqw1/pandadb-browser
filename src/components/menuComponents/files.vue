<template>
    <div style="padding: 18px 26px" v-loading="loading">
        <div class="titleS">
            <div class="icon"></div>
            <span style="font-size: 20px; color: #333333; font-weight: 600">文件</span>
        </div>
        <el-row>
            <el-col>
                <el-button type="primary" style="width: 100%;margin-top: 30px;" @click="addFiles">新建文件夹</el-button>
            </el-col>
        </el-row>
        <!-- <img :src="base64Image" alt="" v-if="base64Image!=='' "> -->
        <el-tree style="margin-top: 14px;" v-if="fileTreedata.length" :data="fileTreedata" node-key="id" draggable 
            @node-drag-end="nodeEndDrop" :allow-drop="allowDrop" @node-drag-start="nodeDragStart">
            <template #default="scoped">
                <el-row style="width: 100%;padding-right: 6px">
                    <el-col :span="22" style="display: flex;align-items: center;">
                        <el-icon v-if="scoped.data.isFile" style="margin-right:6px" @click="nodeClick(scoped)">
                            <View />
                        </el-icon>
                        <span @dblclick="renameClick(scoped)" v-if="!scoped.data.show">{{ scoped.data.label }}</span>
                        <el-input v-else id="myInput" v-model="scoped.data.label"
                            @blur="handleEnter(scoped)"></el-input>

                    </el-col>
                    <el-col :span="2" v-if="!scoped.data.isFile">
                        <el-popover placement="bottom" :width="200" trigger="hover">
                            <div style="cursor: pointer;" @click="newFolderClick(scoped)">New Folder</div>
                            <el-upload v-model:file-list="fileList" multiple :show-file-list="false"
                                :http-request="requestUpload" :before-upload="beforeUpload">
                                <div @click="UploadClick(scoped)">Upload File</div>
                            </el-upload>
                            <div style="cursor: pointer;" @click="delClick(scoped)"> Delete Folder</div>
                            <template #reference>
                                <el-icon size="14">
                                    <More />
                                </el-icon>
                            </template>
                        </el-popover>
                    </el-col>
                    <el-col :span="2" v-else>
                        <el-popover placement="bottom" :width="200" trigger="hover">
                            <div style="cursor: pointer;" @click="delClick(scoped)"> Delete</div>
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
        <el-image style="width: 100px; height: 100px; display: none;" :preview-teleported="true" :src="url"
            :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-src-list="[base64Image]" :initial-index="1"
            fit="cover" class="elImageClass" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { More, View } from '@element-plus/icons-vue'
import getManageInfo from "../../utils/manageRequest"
import { ElMessage, ElMessageBox } from 'element-plus'
const fileTreedata = ref([])
const name = ref("")
const newname = ref("")
const fileList = ref([])
const scopedInfo = ref({})
const startNodePath = ref("")
const loading = ref(false)
const base64Image = ref("")
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
    const treeData = await getManageInfo(treeUrl, "GET")
    fileTreedata.value = treeData.response
}
onMounted(async () => {
    //获取树形结构
    await obtainTree()
})
//新建文件夹
const addFiles = async () => {
    fileTreedata.value.push({
        "id": generateRandomId(),
        "isFile": false,
        "label": "新建文件夹",
        "show": true,
        "new": true
    })
}
//重命名
const renameClick = (scoped) => {
    scoped.data.show = true
    name.value = scoped.data.label
    nextTick(() => {
        document.getElementById("myInput").focus();
    })
}
//重命名失去焦点
const handleEnter = async (scoped) => {
    scoped.data.show = false
    if (scoped.data.new) {
        //新建文件夹
        const fileuploadUrl = replaceOrAddUrlPath(url, '/file/upload')
        const filePathArr = getNodeParentNames(scoped.data.id, fileTreedata.value)
        let filePath = filePathArr.filter(item => item !== undefined).join('/') + '/' + scoped.data.label
        if (filePathArr.length !== 0) {
            filePath = filePathArr.filter(item2 => item2 !== undefined).join('/') + '/' + scoped.data.label
        } else {
            filePath = scoped.data.label
        }

        const fileuploadquery = {
            fileData: "",
            filePath: filePath
        }
        await getManageInfo(fileuploadUrl, "POST", JSON.stringify(fileuploadquery))
        await obtainTree()
    } else {
        //重命名
        newname.value = scoped.data.label
        const filePathArr = getNodeParentNames(scoped.data.id, fileTreedata.value)
        const filePath = filePathArr.filter(item => item !== undefined).join('/')
        let oldFilePath = filePathArr.filter(item => item !== undefined).join('/') + '/' + name.value
        let newFilePath = filePathArr.filter(item => item !== undefined).join('/') + '/' + newname.value
        if (filePathArr.length !== 0) {
            oldFilePath = filePathArr.filter(item => item !== undefined).join('/') + '/' + name.value
            newFilePath = filePathArr.filter(item => item !== undefined).join('/') + '/' + newname.value
        } else {
            oldFilePath = name.value
            newFilePath = newname.value
        }
        const renameUrl = replaceOrAddUrlPath(url, '/file/rename')
        const renameQuery = {
            "oldFilePath": oldFilePath,
            "newFilePath": newFilePath
        }
        await getManageInfo(renameUrl, "POST", JSON.stringify(renameQuery))
        await obtainTree()
    }
}
const allowDrop = (draggingNode, dropNode, type) => {
    if (dropNode.data.isFile === true) {
        return false
    } else {
        return true
    }
}
const newFolderClick = (scoped) => {
    scoped.data.children.push({
        "id": generateRandomId(),
        "isFile": false,
        "label": "新建文件夹",
        "show": true,
        "new": true,
        children: []
    })
}
//获取树形父级结构
const getNodeParentNames = (nodeId, nodes, parentId = null) => {
    let parentNames = [];
    for (const node of nodes) {
        if (node.id === nodeId) {
            if (parentId !== null) {
                // 查找父节点并递归获取其名称  
                const parentNode = nodes.find(n => n.children?.some(child => child.id === parentId));
                parentNames = [...getNodeParentNames(parentId, nodes, parentNode?.parentId), parentNode?.label];
            }
            break;
        } else if (node.children) {
            // 递归检查子节点
            const childResult = getNodeParentNames(nodeId, node.children, node.id);
            if (childResult.length > 0) {
                parentNames = [...parentNames.length > 0 ? parentNames : [node.label], ...childResult];
                break;
            }
        }
    }
    return parentNames;
}
//文件上传
const beforeUpload = async (uploadFile) => {
    uploadFile.label = uploadFile.name
    let isFileName = scopedInfo.value.data.children.every((item) => {
        return item.name !== uploadFile.name
    })//判断此文件夹是否有相同文件
    if (isFileName) {
        const isLt2M = uploadFile.size / 1024 / 1024 < 2; // 限制文件大小不超过2MB
        if (!isLt2M) {
            ElMessage("大小不超过2MB")
            return false;
        }
        const reader = new FileReader();
        reader.readAsDataURL(uploadFile);
        reader.onload = async (e) => {
            const base64String = e.target.result;
            const filePathArr = getNodeParentNames(scopedInfo.value.node.data.id, fileTreedata.value)
            let filePath = filePathArr.filter(item => item !== undefined).join('/')
            if (filePathArr.length !== 0) {
                filePath = filePath + '/' + scopedInfo.value.data.label + '/' + uploadFile.label
            } else {
                filePath = scopedInfo.value.data.label + '/' + uploadFile.label
            }
            const uploadUrl = replaceOrAddUrlPath(url, '/file/upload')
            const queryText = {
                'fileData': base64String,
                'filePath': filePath,

            }
            await getManageInfo(uploadUrl, "POST", JSON.stringify(queryText))
            await obtainTree()
        };
    }
}
const requestUpload = () => {

}
const UploadClick = (scoped) => {
    scopedInfo.value = scoped
}
//删除
const delClick = async (scoped) => {
    const filePathArr = getNodeParentNames(scoped.data.id, fileTreedata.value)
    let filePath = ""
    const delUrl = replaceOrAddUrlPath(url, '/file/delete')
    let delquery = {}
    if (scoped.data.isFile === false) {
        if (scoped.node.level === 1) {
            filePath = scoped.data.label
        } else {
            filePath = filePathArr.filter(item2 => item2 !== undefined).join('/') + "/" + scoped.data.label
        }
        delquery = {
            "filePath": filePath
        }
    } else {
        filePath = filePathArr.filter(item3 => item3 !== undefined).join('/') + '/' + scoped.data.label
        delquery = {
            "filePath": filePath
        }
    }

    await getManageInfo(delUrl, "DELETE", JSON.stringify(delquery))
    await obtainTree()
}
//拖拽到目标节点
const nodeEndDrop = async (draggingNode, dropNode, type) => {
    const dropArr = getNodeParentNames(dropNode.data.id, fileTreedata.value)
    let dropPath
    if (type === "inner") { // 如果是往里面放，并且没有找到父级，说明是最外面一层的
        if (dropArr.length) {
            if (dropNode.level >= 2) {
                dropPath = dropArr.filter(item => item !== undefined).join('/') + "/" + dropNode.data.label + "/" + draggingNode.data.label
            } else {
                dropPath = dropArr.filter(item => item !== undefined).join('/') + "/" + draggingNode.data.label
            }
        } else {
            dropPath = dropNode.data.label + "/" + draggingNode.data.label // 那么就找到 拖动结束 + “/” + 拖动开始
        }
    } else { // if (type === "before" || type === "after") 如果是往外面拿
        if (dropArr.length) { // 并且有父级，说明不是最外面一层
            dropPath = dropArr.filter(item => item !== undefined).join('/') + "/" + draggingNode.data.label
        } else {
            dropPath = draggingNode.data.label
        }
    }

    // fileTreedata.value.includes(draggingNode)
    const moveUrl = replaceOrAddUrlPath(url, '/file/move')
    if (!dropPath || startNodePath.value === dropPath) {

    } else {
        const movequery = {
            "oldFilePath": startNodePath.value,
            'newFilePath': dropPath
        }
        await getManageInfo(moveUrl, "POST", JSON.stringify(movequery))
        await obtainTree()
    }

}
const nodeDragStart = async (startNode) => {
    const draggingArr = getNodeParentNames(startNode.data.id, fileTreedata.value)
    if (draggingArr.length !== 0) {
        startNodePath.value = draggingArr.filter(item => item !== undefined).join('/') + '/' + startNode.label
    } else {
        startNodePath.value = startNode.label
    }

}
const nodeClick = async (node) => {
    if (node.data.isFile === false) {
        return
    } else {
        const nodeArr = getNodeParentNames(node.data.id, fileTreedata.value)
        let nodePath = ""
        if (nodeArr.length !== 0) {
            nodePath = nodeArr.filter(item => item !== undefined).join('/') + '/' + node.data.label
        } else {
            nodePath = node.data.label
        }
        const downloadUrl = replaceOrAddUrlPath(url, '/file/download')
        const downloadquery = {
            'filePath': nodePath
        }
        loading.value = true
        const img = await getManageInfo(downloadUrl, "POST", JSON.stringify(downloadquery))
        base64Image.value = img.response
        document.querySelector('.elImageClass').children[0].click()
        loading.value = false
    }
}

</script>

<style scoped>
::v-deep .el-loading-spinner .path {
    stroke: #6a8322 !important;
}

::v-deep .el-tree-node__content {
    height: 36px;
}
</style>