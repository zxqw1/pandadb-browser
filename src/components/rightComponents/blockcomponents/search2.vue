<template>
  <el-row
    class="search"
    :style="{
      height: isFullscreen ? '100vh' : 'auto',
      padding: isFullscreen ? '20px' : 'auto',
    }"
  >
    <el-col :span="22" style="position: relative">
      <div
        class="bing-code-editor"
        :style="{ height: isFullscreen ? '97vh' : 'auto' }"
      >
        <textarea
          ref="textarea"
          v-model="contentValue"
          style="width: 70%; background-color: rgb(246, 246, 246)"
        >
        </textarea>
      </div>
      <CaretRightOutlined
        style="
          color: #6a8322;
          font-size: 28px;
          position: absolute;
          right: 10px;
          top: 4px;
        "
        @click="funClick"
         v-if="!loadingFlag"
      />
      <div v-else style="width: 14px; height: 14px; background-color: red;position: absolute;right: 16px; top: 10px;" @click="breakClick"></div>
    </el-col>
    <el-col
      :span="2"
      style="
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        position: relative;
      "
    >
    <el-col :span="12" style="text-align: center;padding-top: 8px;">
      <StarOutlined style="font-size: 20px;position: absolute;right: 26px; top: 10px;"  @click="collectClick"/>
    </el-col>
      <el-col :span="12" style="text-align: center;padding-top: 8px;">
        <VerticalAlignBottomOutlined
        style="font-size: 20px;position: absolute;right: 66px; top: 10px;"
        @click="imgClick"
      />
      </el-col>
      
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { computed, markRaw, nextTick, onMounted, ref, reactive } from "vue";
import mitts from "../../../utils/bus.js";
import {
  CaretRightOutlined,
  ExpandAltOutlined,
  ShrinkOutlined,
  StarOutlined,
  VerticalAlignBottomOutlined,
} from "@ant-design/icons-vue";
import { ElMessageBox } from "element-plus";
import request from "../../../utils/request.js";
//框架
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/darcula.css";
//主题
import "codemirror/theme/idea.css";
import { useStore } from "vuex";
const loadingFlag = ref(false)
const store = useStore();
const props = defineProps(["command","index",'item']);
const mode = "javascript"; // 编译语言
const height = ref(150);
const theme = "idea"; // 主题语言
const textarea = ref(null);
let editorInstance: any = null;
const contentValue = ref(props.command);
const isFullscreen = ref<boolean>(false);
const keywords = ref([
  ["MATCH", "match"],
  ["RETURN", "match"],
  ["LIMIT", "match"],
  ["CREATE", "match"],
  ["match", "match"],
  ["return", "match"],
  ["limit", "match"],
  ["create", "match"],
  ["0", "number"],
  ["1", "number"],
  ["2", "number"],
  ["3", "number"],
  ["4", "number"],
  ["5", "number"],
  ["6", "number"],
  ["7", "number"],
  ["8", "number"],
  ["9", "number"],
  [`"node"`, "keys"],
  [`"relationship"`, "keys"],
]);
const opt = ref({
  theme: theme, //主题
  styleActiveLine: true, //高亮当前行
  lineNumbers: true, //行号
  lineWrapping: true, //自动换行
  tabSize: 4, //Tab缩进
  indentUnit: 4, //缩进单e位
  indentWithTabs: true, //自动缩进
  mode: mode, //语言
  readOnly: false, //只读
  lint: true, // 格式化
  foldGutter: true, // 启用折叠效果
  hintOptions: {
    // 代码提示
    completeSingle: false, // 当匹配只有一项的时候是否自动补全
    // hint: this.bingShowHint, // 自定义提示
  },
  gutters: [
    "CodeMirror-linenumbers",
    "CodeMirror-foldgutter",
    "CodeMirror-lint-markers",
  ],
});
let abortController: AbortController | null = null;
//获取数据
const funClick = async () => {
  await nextTick();
  if (contentValue.value === "") {
    console.log(111);
  } else {
    loadingFlag.value = !loadingFlag.value
    const startTime = performance.now();
    // 创建新的 AbortController 实例  
    abortController = new AbortController();
  fetch(window.localStorage.getItem('address'), {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: contentValue.value,
    signal: abortController.signal,
  })
    .then((response) => response.text())
    .then((data) => {
      loadingFlag.value = !loadingFlag.value
        const data2 = JSON.parse(data);
        if (data2.error) {
          // console.log(data2, "186");
          const result = {};
          result.summary = {};
          result.summary.query = {};
          result.summary.server = {};
          result.summary.query.text = data2.query;
          result.summary.server.address = window.localStorage.getItem('address');
          result.summary.server.agent = "PandaDB";
          result.error = data2.error;
          mitts.emit("revamp", {result:result,index:props.index,id:props.item.id,item:props.item});
          store.commit("ScrollChange", result);
        }else{
          const endTime = performance.now();
          const result = {};
          result.records = [];
          result.summary = {};
          result.summary.query = {};
          result.summary.server = {};
      const data2 = JSON.parse(data);
      const responseTime = endTime - startTime;
          result.resTime = Math.round(responseTime) + "ms";
        data2.response.forEach((value, key) => {
            const keys = Object.keys(value);
            for (let key in value) {
          result.records.push({ keys: keys, _fields: [value[key]] });
            }
          });
          result.summary.query.text = data2.query;
          result.summary.server.address = window.localStorage.getItem('address');
          result.summary.server.agent = "PandaDB";
      // mitts.emit("revamp", (result,props.index));
          mitts.emit("revamp", {result:result,index:props.index,id:props.item.id,item:props.item});
          store.commit("ScrollChange", result);
        }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  }
};
//下载图片
const imgClick = () =>{
  mitts.emit("download", props.item)
}
//删除
const deleteClick = () => {
  editorInstance.setValue("");
};
//收藏
const collectClick = ()=>{
  console.log(contentValue.value,'150')
  mitts.emit('command',contentValue.value )
}
onMounted(() => {
  CodeMirror.defineMode("javascript", function () {
    return {
      token: (stream, state) => {
        const cmCustomCheckStreamFn = (streamWrapper) => {
          for (let i = 0; i < keywords.value.length; i++) {
            if (streamWrapper.match(keywords.value[i][0])) {
              return keywords.value[i][1];
            }
          }
          return "";
        };
        const ret = cmCustomCheckStreamFn(stream);
        if (ret.length > 0) return ret;
        stream.next();
        return null;
      },
    };
  });
  editorInstance = markRaw(CodeMirror.fromTextArea(textarea.value, opt.value));
  editorInstance.on("change", (coder, data) => {
    contentValue.value = coder.getValue();
  });
  // 输入或者粘贴时触发
  editorInstance.on("inputRead", (coder) => {
    const cursor = coder.getDoc().getCursor();
    const token = coder.getTokenAt(cursor);
    if (token.string.trim() == "") {
    }
  });
  // },
});
computed((_height) => {
  return Number(height.value) ? Number(height.value) + "px" : height.value;
});

</script>

<style scoped>
.search {
  width: 100%;
  background-color: #ffffff;
  padding: 14px 16px;
}
.bing-code-editor {
  font-size: 14px;
  border: 1px dashed #c0c0c0;
  border-radius: 5px;
  line-height: 180%;
}
</style>