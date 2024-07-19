<template>
  <div class="favorate" style="padding: 18px 26px">
    <!-- 标题 -->
    <div class="titleS">
      <div class="icon"></div>
      <span style="font-size: 20px; color: #333333; font-weight: 600"
        >偏好</span
      >
    </div>
    <!-- 内容 -->
    <a-row style="display: flex; flex-direction: column">
      <a-col
        style="
          margin-top: 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px #999 solid;
          padding-right: 10px;
        "
      >
        <div style="display: flex; align-items: center">
          <div class="circle"></div>
          <div class="name">本地</div>
        </div>
        <el-icon @click="addfileClick">
          <FolderAdd style="width: 20px; height: 20px; cursor: pointer" />
        </el-icon>
      </a-col>
      <a-col>
        <el-tree
          style="max-width: 600px"
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          :data="TreeData"
          draggable
          default-expand-all
          node-key="id"
          @node-drag-start="handleDragStart"
          @node-drag-enter="handleDragEnter"
          @node-drag-leave="handleDragLeave"
          @node-drag-over="handleDragOver"
          @node-drag-end="handleDragEnd"
          @node-drop="handleDrop"
          :render-content="renderContent"
        >
          <template #default="scoped">
            <div style="width: 100%; display: flex" id:scoped.data.id>
              <div style="display: flex; flex: 1">
                <Folder
                  style="width: 22px; height: 22px"
                  v-if="scoped.data.type === 'files'"
                />
                <p
                  v-if="scoped.data.show"
                  style="
                    flex: 1;
                    width: 1px;
                    margin-right: 1px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  "
                  :title="scoped.node.label"
                >
                  {{ scoped.node.label }}
                </p>
                <el-input
                  style="width: 90%"
                  v-else
                  v-model="scoped.data.label"
                  @blur="handleEnter(scoped)"
                ></el-input>
              </div>
              <el-popover
                placement="bottom"
                title=""
                :width="200"
                trigger="click"
                content=""
              >
                <div class="hoverText" @click="RenameClick(scoped)">
                  Rename folder
                </div>
                <div class="hoverText" @click="deleteClick(scoped)">
                  Delete folder
                </div>
                <div class="hoverText">Export scripts as .zip file</div>
                <div class="hoverText">Export scripts as .cypher file</div>
                <template #reference>
                  <el-icon style="height: 22px; width: 22px"
                    ><MoreFilled
                      style="width: 22px; height: 22px"
                      @click="showPopover"
                  /></el-icon>
                </template>
              </el-popover>
            </div>
          </template>
        </el-tree>
      </a-col>

      <!-- <a-col style="margin-top: 30px; display: flex; align-items: center">
        <div class="circle"></div>
        <div class="name">示例</div>
      </a-col>
      <a-col>
      </a-col> -->
    </a-row>
  </div>
</template>

<script setup lang="ts">
import type { TreeProps } from "ant-design-vue";
import { ref, onMounted } from "vue";
import mitts from "../../utils/bus.js";
import { FolderAdd, Folder, MoreFilled } from "@element-plus/icons-vue";
import type Node from "element-plus/es/components/tree/src/model/node";
import type { DragEvents } from "element-plus/es/components/tree/src/model/useDragNode";
import type {
  AllowDropType,
  NodeDropType,
} from "element-plus/es/components/tree/src/tree.type";
const buttonRef = ref(false);
const input = ref("");
const renameFlag = ref(false);
const TreeData = ref([]);
//删除
const deleteClick = (scoped) => {
  TreeData.value = TreeData.value.filter((item) => {
    return item.id !== scoped.data.id;
  });
};

const RenameClick = (scoped) => {
  scoped.data.show = !scoped.data.show;
};
console.log(TreeData.value, "112");
const handleEnter = (scoped) => {
  // scoped.data.label =
  // console.log(input.value,'119')
  // console.log(scoped,'120')
  // TreeData.value.forEach(item=>{
  //   if(item.id === scoped.data.id){
  //     item.label = input.value
  RenameClick(scoped);
  //   }
  // })
};
//没有子元素也有箭头显示
if (TreeData.value.length !== 0) {
  function ensureChildren(nodes) {
    nodes.forEach((node) => {
      if (!node.children) {
        node.children = [];
      }
      if (node.children && node.children.length > 0) {
        ensureChildren(node.children);
      }
    });
  }
  ensureChildren(TreeData);
}
// const renderContent = (h, { node, data, store })=>{
// if(data.editable){
//    // 编辑状态，显示输入框
//    return (
//           <span>
//             <el-input
//               v-model={data.label}
//               @blur={() => this.handleEditEnd(node, data)}
//               placeholder="请输入节点名称"
//             ></el-input>
//           </span>
//         );
// }else{
//       // 非编辑状态，显示节点名称，并提供编辑的触发方式
//       return (
//           <span on-click={() => this.handleEditStart(node, data)}>
//             {node.label}
//             <i class="el-icon-edit" style="cursor: pointer; margin-left: 8px;"></i>
//           </span>
//         );
// }
// }
const handleEditStart = (node, data) => {
  // 开始编辑节点名称
  data.editable = true;
  // 可以在这里做一些额外的初始化工作，比如设置输入框的焦点等
};
const handleEditEnd = (node, data) => {
  // 结束编辑节点名称
  data.editable = false;
  // 可以在这里做一些验证或清理工作
};
const handleDragStart = (node: Node, ev: DragEvents) => {
  console.log("drag start", node);
};
const handleDragEnter = (
  draggingNode: Node,
  dropNode: Node,
  ev: DragEvents
) => {
  console.log("tree drag enter:", dropNode.label);
};
const handleDragLeave = (
  draggingNode: Node,
  dropNode: Node,
  ev: DragEvents
) => {
  console.log("tree drag leave:", dropNode.label);
};
const handleDragOver = (draggingNode: Node, dropNode: Node, ev: DragEvents) => {
  console.log("tree drag over:", dropNode.label);
};
const handleDragEnd = (
  draggingNode: Node,
  dropNode: Node,
  dropType: NodeDropType,
  ev: DragEvents
) => {
  console.log("tree drag end:", draggingNode, dropNode, dropType, ev);
};
const handleDrop = (
  draggingNode: Node,
  dropNode: Node,
  dropType: NodeDropType,
  ev: DragEvents
) => {
  if (dropNode.level >= 2 && dropType !== "before" && dropType !== "after") {
    // 1.文件夹不允许拖拽
    // 2.文件拖到文件夹才可以，文件和文件不允许合并对
    dropNode.parent.data.children[0].children = [];
    TreeData.value.push(draggingNode.data);
    alert("操作失败，最多添加两级！")
  }
};
const allowDrop = (draggingNode: Node, dropNode: Node, type: AllowDropType) => {
  if (dropNode.data.label === "Level two 3-1") {
    return type !== "inner";
  } else {
    return true;
  }
};
const allowDrag = (draggingNode: Node) => {
  return !draggingNode.data.label.includes("Level three 3-1-1");
};

//新增文件夹
const addfileClick = () => {
  TreeData.value.push({
    id: TreeData.value.length + 1,
    label: "New Folder",
    show: true,
    editable: false,
    editInput: null,
    type: "files",
  });
  console.log(TreeData, "242");
};
const showPopover = () => {
  buttonRef.value = true;
};
//拿到收藏数据
mitts.on("recommand", (contentValue: any) => {
  TreeData.value.push({
    id: TreeData.value.length + 1,
    label: contentValue,
    show: true,
    editable: false,
    editInput: null,
    type: "file",
  });
  console.log(TreeData, "256");
});
</script>

<style scoped>
/* 修改被选中节点的背景颜色 */
.ant-tree-node-content-wrapper:not(.ant-tree-node-disabled):focus-within,
.ant-tree-node-content-wrapper:not(.ant-tree-node-disabled):hover {
  background-color: #6a8322; /* 你想要的任何颜色 */
}
.hoverText {
  padding-left: 4px;
}
.hoverText:hover {
  cursor: pointer;
  background-color: #eeeeee;
}
.el-input {
  height: 24px;
}
</style>