<template>
    <div style="padding: 18px 26px">
        <!-- 标题 -->
        <div class="titleS">
            <div class="icon"></div>
            <span style="font-size: 20px; color: #333333; font-weight: 600">文件</span>
        </div>
        <!-- 内容 -->
        <el-row>
            <el-col>
                <el-button type="primary" style="width: 100%;margin-top: 30px;" @click="addFiles">新建文件夹</el-button>
            </el-col>
            <el-col>
                <el-tree style="max-width: 600px;margin-top: 20px;" :allow-drop="allowDrop" :allow-drag="allowDrag"
                    :data="fileTreedata" draggable empty-text="" default-expand-all node-key="id"
                    @node-drag-start="handleDragStart" @node-drag-enter="handleDragEnter"
                    @node-drag-leave="handleDragLeave" @node-drag-over="handleDragOver" @node-drag-end="handleDragEnd"
                    @node-drop="handleDrop" @node-click="handleNodeClick">
                    <template #default="scoped">
                        <el-row style="width: 100%;">
                            <el-col :span="3">
                                <Folder style="height: 22px; width: 22px;" v-if="scoped.data.type === 'files'" />
                                <Document style="height: 22px; width: 22px;" v-if="scoped.data.type === 'file'" />
                            </el-col>
                            <el-col :span="19">
                                <p v-if="scoped.data.show" style="
                                    margin-right: 1px;
                                    overflow: hidden;
                                    white-space: nowrap;
                                    text-overflow: ellipsis;" :title="scoped.node.label"
                                    @dblclick="handleDoubleClick(scoped)">
                                    {{ scoped.node.label }}
                                </p>
                                <span v-else-if="scoped.data.uid">{{ scoped.data.name }}</span>
                                <el-input v-else id="myInput" style="width: 80%;height: 20px;"
                                    v-model="scoped.data.label" @blur="handleEnter(scoped)"></el-input>
                            </el-col>
                            <el-col :span="2">
                                <el-popover placement="bottom" title="" :width="200" trigger="click" content=""
                                    v-if="scoped.data.type === 'files'">
                                    <div class="hoverText" @click="newFolderClick(scoped)" style="cursor: pointer;">
                                        New Folder
                                    </div>
                                    <el-upload class="upload-demo" :before-upload="handleChange">
                                        <div class="hoverText" @click="UploadClick(scoped)" style="cursor: pointer;">
                                            Upload Flie
                                        </div>
                                    </el-upload>
                                    <div class="hoverText" @click="removeClick(scoped)" style="cursor: pointer;">
                                        Remove Folder
                                    </div>
                                    <template #reference>
                                        <el-icon style="height: 22px; width: 22px">
                                            <MoreFilled style="width: 22px; height: 22px" @click="showPopover" />
                                        </el-icon>
                                    </template>
                                </el-popover>
                                <el-popover placement="bottom" title="" :width="200" trigger="click" content=""
                                    v-if="scoped.data.type === 'file'">
                                    <div class="hoverText" @click="deletefileclick(scoped)" style="cursor: pointer;">
                                        Delete File
                                    </div>
                                    <template #reference>
                                        <el-icon style="height: 22px; width: 22px">
                                            <MoreFilled style="width: 22px; height: 22px" @click="showPopover" />
                                        </el-icon>
                                    </template>
                                </el-popover>
                            </el-col>
                        </el-row>
                    </template>
                </el-tree>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import {
    Folder,
    MoreFilled,
    Document
} from "@element-plus/icons-vue";
const fileTreedata = ref(!JSON.parse(localStorage.getItem("fileTreedata")) ? [] : JSON.parse(localStorage.getItem("fileTreedata")));
const buttonRef = ref(false);
const scopedInfo = ref(undefined);
const url = ref("")
//新建文件夹
const addFiles = () => {
    fileTreedata.value.push({
        label: '新建文件夹',
        children: [],
        show: false,
        type: 'files'
        // fileList: []
    })
    nextTick(() => {
        document.getElementById("myInput").focus();
    })
    window.localStorage.setItem("fileTreedata", JSON.stringify(fileTreedata.value));
}
const handleEnter = (scoped) => {
    scoped.data.show = !scoped.data.show;
    window.localStorage.setItem("fileTreedata", JSON.stringify(fileTreedata.value));
}
const showPopover = () => {
    buttonRef.value = true;
};
//双击修改
const handleDoubleClick = (scoped) => {
    scoped.data.show = !scoped.data.show;
    nextTick(() => {
        document.getElementById("myInput").focus();
    })
    window.localStorage.setItem("fileTreedata", JSON.stringify(fileTreedata.value));
}
//文件里新建文件夹
const newFolderClick = (scoped) => {
    scoped.data.children.push({
        label: '新建文件夹',
        children: [],
        show: false,
        type: 'files'
        // fileList: []
    })
    buttonRef.value = false;
    window.localStorage.setItem("fileTreedata", JSON.stringify(fileTreedata.value));
}
//上传图片
const UploadClick = (scoped) => {
    scopedInfo.value = scoped.data
    const parentNodes = getParentNodes(scoped.node);
    let labels = ""
    let currentLabel = scoped.node.label
    parentNodes.reverse().forEach((item, index) => {
        if (!Array.isArray(item)) {
            labels += item.label + "/"
        }
    })
    url.value = labels + currentLabel
    window.localStorage.setItem("fileTreedata", JSON.stringify(fileTreedata.value));
}
//上传图片
const handleChange = (uploadFile, uploadFiles) => {
    let targetNode = findNodeById(fileTreedata.value, scopedInfo.value.id);
    if (targetNode) {
        // 向children数组添加新元素  
        targetNode.children.push({
            id: 5,
            label: uploadFile.name,
            children: [],
            type: 'file'
        });
    }
    const formData = new FormData()
    formData.append('file', uploadFile)
    formData.append('uploadDir', url.value)
    let fileUrl = window.localStorage.getItem('address').replace("/query", "/file")
    fetch(fileUrl, {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            console.error('Error:', error);
        });
    window.localStorage.setItem("fileTreedata", JSON.stringify(fileTreedata.value));
}
//当前节点
const findNodeById = (nodes, id) => {
    for (let node of nodes) {
        if (node.id === id) {
            return node;
        }
        if (node.children && node.children.length > 0) {
            let result = findNodeById(node.children, id);
            if (result) {
                return result;
            }
        }
    }
    return null;
}
// scopedInfo.value.children.push(uploadFile)
// console.log(scopedInfo.value, '129')
// const formData = new FormData()
// formData.append('file',uploadFile)
// formData.append('uploadDir',url.value )
// let fileUrl = window.localStorage.getItem('address').replace("/query","/file")
// console.log(fileUrl,'135')
// fetch(fileUrl, {
//         method: 'POST',
//         body: formData
//     })
//         .then(response => response.text())
//         .then(data => {
//             console.log(data)
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
//         window.localStorage.setItem("fileTreedata", JSON.stringify(fileTreedata.value));

//拿到父节点
const getParentNodes = (node) => {
    const parentNodes = [];
    let currentNode = node;
    while (currentNode.parent) {
        // 注意：这里我们直接访问 currentNode.parent.data 来获取父节点的数据  
        // 因为 currentNode.parent 本身就是一个节点对象，而我们需要的是它的数据部分  
        parentNodes.push(currentNode.parent.data);
        currentNode = currentNode.parent;
    }
    // 注意：这个数组不包含根节点（因为根节点没有 parent），如果你需要包含根节点，  
    // 你需要单独处理或者确保你的树形数据结构中有一个虚拟的根节点对象  
    return parentNodes;
}
//删除文件夹
const removeClick = (scoped) => {
    removeNodeById(fileTreedata.value, scoped.node.id)
    window.localStorage.setItem("fileTreedata", JSON.stringify(fileTreedata.value));
}
//删除文件
const deletefileclick = (scoped) => {
    removeNodeById(fileTreedata.value, scoped.node.id)
    window.localStorage.setItem("fileTreedata", JSON.stringify(fileTreedata.value));
}
//删除
const removeNodeById = (nodes: any[], idToRemove: string): void => {
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].$treeNodeId === idToRemove) {
            // 找到并删除节点
            nodes.splice(i, 1);
            return; // 如果不需要删除所有匹配的节点，则在此处返回
        }
        if (nodes[i].children && nodes[i].children.length > 0) {
            // 递归地检查子节点
            removeNodeById(nodes[i].children, idToRemove);
        }
    }
};
</script>

<style scoped></style>