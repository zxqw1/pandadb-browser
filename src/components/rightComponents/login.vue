<template>
  <div
    style="
      padding: 70px;
      background-color: #ffffff;
      width: 100%;
      margin-top: 24px;
      display: flex;
      height: 424px;
    "
  >
    <div style="display: flex; flex-direction: column" v-if="open">
      <h1>登录页</h1>
      <h3>您已连接，欢迎</h3>
    </div>
    <div style="display: flex; flex-direction: column" v-else>
      <h1>登录页</h1>
      <p>您还未登录哦,请登录</p>
    </div>
    <a-row>
      <a-col v-if="open" style="padding-left: 60px">
        <p>
          <span style="font-size: 20px"> 您已连接至用户</span>
        </p>
        <p>
          <span style="font-size: 20px"> 地址为</span>
          <span style="padding-left: 20px; color: #6a8322; font-size: 20px">{{
            href
          }}</span>
        </p>
        <p>
          <span style="font-size: 20px"> 连接凭据存储在web浏览器中</span>
        </p>
      </a-col>
      <a-col
        v-else
        style="
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          padding-left: 50px;
        "
      >
        <div class="mt-4">
          <div style="font-size: 14px; font-weight: 500; margin-bottom: 4px">
            ConnectUrl
          </div>
          <el-input
            v-model="input3"
            style="max-width: 600px"
            placeholder="0.0.0.0:7680/query"
            class="input-with-select"
          >
            <template #prepend>
              <el-select
                v-model="select"
                placeholder="请选择"
                style="width: 115px"
              >
                <el-option label="http://" value="http://" />
                <!-- <el-option label="bolt://" value="bolt://" /> -->
              </el-select>
            </template>
          </el-input>
        </div>
        <div>
          <div style="font-size: 14px; font-weight: 500; margin-bottom: 4px">
            UserName
          </div>
          <el-input v-model="input" placeholder="请输入用户名" />
        </div>
        <div>
          <div style="font-size: 14px; font-weight: 500; margin-bottom: 4px">
            password
          </div>
          <el-input
            v-model="input2"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </div>
        <div>
          <el-button type="primary" @click="loginClick">登录</el-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
const open = ref<boolean>(false);
const select = ref("http://");
const input3 = ref("");
const input = ref("");
const input2 = ref("");
// const username = window.localStorage.getItem("username");
const href = window.localStorage.getItem("address");
const ipPortRegex = /^(\d{1,3}\.){3}\d{1,3}:\d{1,5}(\/[^\s]*)?$/;
//拿到输入内容
const loginClick = () => {
  //非空校验
  if (input3.value === "") {
    ElMessageBox.alert("地址不能为空", "提示", {
      confirmButtonText: "好的",
    });
  } else {
    if (!ipPortRegex.test(input3.value)) {
      ElMessageBox.alert("请输入有效的IP地址和端口号", "提示", {
        confirmButtonText: "好的",
      });
    } else {
      window.localStorage.setItem("address", select.value + input3.value);
      window.localStorage.setItem("username",input.value)
      // window.localStorage.setItem("password",input2.value)
      open.value = true;
      window.location.reload();
    }
  }
};

//判段是否登录
onMounted(() => {
  if (window.localStorage.getItem("address")) {
    open.value = true;
  } else {
    ElMessageBox.alert("您暂未登录哦，请登录", "提示", {
      confirmButtonText: "好的",
    });
  }
});
</script>

<style scoped>
:where(.css-dev-only-do-not-override-16pw25h).ant-col-8 {
  max-width: 10% !important;
}
</style>