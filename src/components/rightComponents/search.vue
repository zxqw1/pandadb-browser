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
      />
    </el-col>
    <el-col
      :span="2"
      style="
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: space-around;
      "
    >
      <ExpandAltOutlined
        style="font-size: 20px"
        @click="toggleFullScreen"
        v-if="!isFullscreen"
      />
      <ShrinkOutlined
        style="font-size: 20px; position: absolute; top: 28px"
        @click="toggleFullScreen"
        v-else
      />
      <CloseOutlined
        style="font-size: 20px"
        :style="{
          position: isFullscreen ? 'absolute' : 'static',
          top: isFullscreen ? '28px' : 'auto',
          right: isFullscreen ? '10px' : 'auto',
        }"
        @click="deleteClick"
      />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { computed, markRaw, nextTick, onMounted, ref, reactive } from "vue";
import mitts from "../../utils/bus.js";
import {
  CaretRightOutlined,
  ExpandAltOutlined,
  CloseOutlined,
  ShrinkOutlined,
} from "@ant-design/icons-vue";
import { ElMessageBox } from "element-plus";
import request from "../../utils/request.js";
//框架
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/darcula.css";
//主题
import "codemirror/theme/idea.css";
import { error } from "neo4j-driver";
import { useStore } from "vuex";
const store = useStore();
const mode = "javascript"; // 编译语言
const height = ref(150);
const theme = "idea"; // 主题语言
const textarea = ref(null);
let editorInstance = null;
const contentValue = ref("");
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
  indentUnit: 4, //缩进单位
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
//喜好渲染
mitts.on("favo", (cypher) => {
  const startTime = performance.now();
  fetch("http://10.0.82.146:7601", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: cypher,
  })
    .then((response) => response.text())
    .then((data) => {
      const data2 = JSON.parse(data);
      if (data2.error) {
        console.log(data2, "186");
        const result = {};
        result.summary = {};
        result.summary.query = {};
        result.summary.server = {};
        result.summary.query.text = data2.query;
        result.summary.server.address = "http://10.0.82.146:7601";
        result.summary.server.agent = "PandaDB";
        result.error = error;
        mitts.emit("params", result);
      } else {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        console.log(JSON.parse(data), "data");
        const result = {};
        result.records = [];
        result.summary = {};
        result.summary.query = {};
        result.summary.server = {};
        result.resTime = Math.round(responseTime) + "ms";
        data2.response.forEach((value, key) => {
          const keys = Object.keys(value);
          for (let key in value) {
            result.records.push({ keys: keys, _fields: [value[key]] });
          }
        });
        result.summary.query.text = data2.query;
        result.summary.server.address = "http://10.0.82.146:7601";
        result.summary.server.agent = "PandaDB";
        console.log(result);
        mitts.emit("params", result);
        store.commit("ScrollChange", result);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
//获取数据
const funClick = async () => {
  await nextTick();
  if (contentValue.value === "") {
    console.log(111);
  } else {
    const startTime = performance.now();
    fetch("http://10.0.82.146:7601", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: contentValue.value,
    })
      .then((response) => response.text())
      .then((data) => {
        const data2 = JSON.parse(data);
        console.log(data2, "184");
        if (data2.error) {
          console.log(data2, "186");
          const result = {};
          result.summary = {};
          result.summary.query = {};
          result.summary.server = {};
          result.summary.query.text = data2.query;
          result.summary.server.address = "http://10.0.82.146:7601";
          result.summary.server.agent = "PandaDB";
          result.error = error;
          mitts.emit("params", result);
        } else {
          const endTime = performance.now();
          const responseTime = endTime - startTime;
          console.log(JSON.parse(data), "data");
          const result = {};
          result.records = [];
          result.summary = {};
          result.summary.query = {};
          result.summary.server = {};
          result.resTime = Math.round(responseTime) + "ms";
          data2.response.forEach((value, index) => {
            const keys = Object.keys(value);
            result.records.push({ keys: keys, _fields: [] });
            for (let key in value) {
              result.records[index]._fields.push(value[key]);
            }
          });
          result.summary.query.text = data2.query;
          result.summary.server.address = "http://10.0.82.146:7601";
          result.summary.server.agent = "PandaDB";
          console.log(result, "271");
          mitts.emit("params", result);
          store.commit("ScrollChange", result);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    deleteClick();
  }
};
// 全屏
const toggleFullScreen = () => {
  isFullscreen.value = !isFullscreen.value;
};
//删除
const deleteClick = () => {
  editorInstance.setValue("");
};
</script>

<style scoped>
 .CodeMirror-line {
  padding-right: 16px !important;
}
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