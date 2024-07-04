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
    <a-col v-if="open" style="padding-left: 60px">
      <p>
        <span style="font-size: 20px"> 您已连接至用户</span>
        <span style="padding-left: 20px; color: #6a8322; font-size: 20px">{{
          userdata
        }}</span>
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
    <a-form
      style="width: 75%"
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="onFinish"
      v-else
    >
    
    <a-input-group compact style="flex-direction: row;
    justify-content: flex-end;align-items: center; margin-bottom: 20px;">
    <div style="font-size: 15px;">地址：</div>
      <a-select v-model:value="value5">
        <a-select-option value="Option1">neo4j://</a-select-option>
        <a-select-option value="Option2">bolt://</a-select-option>
      </a-select>
      <a-input v-model:value="value6" style="width: 60%" />
    </a-input-group>
      <a-form-item label="用户名" name="username">
        <a-input
          v-model:value="formState.username"
          placeholder="请输入用户名"
          autocomplete="current-password"
        />
      </a-form-item>

      <a-form-item label="密码" name="password">
        <a-input-password
          v-model:value="formState.password"
          placeholder="请输入密码"
          autocomplete="current-password"
        />
      </a-form-item>

      <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
        <a-checkbox v-model:checked="formState.remember">记住我</a-checkbox>
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button
          type="primary"
          html-type="submit"
          style="background-color: #6a8322"
          >登录</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus'
const open = ref<boolean>(false);
const value5 = ref<string>('');
const value6 = ref<string>('');
// 拿到输入内容
const formState = reactive({
  username: "",
  password: "",
  remember: true,
});
const userdata: any = window.localStorage.getItem("username");
const href = window.location.href;
// console.log(userdata);
const onFinish = (values: any) => {
  // console.log("Success:", values);
  if (values.username === "" || values.password === "") {
    // 非空校验
    ElMessageBox.alert('用户名和密码不能为空', '提示', {
    confirmButtonText: '好的',
  })
    
  } else {
    window.localStorage.setItem("username", values.username);
    window.localStorage.setItem("password", values.password);
    window.location.reload();
  }
};

//判断是否登录
onMounted(() => {
  if (window.localStorage.getItem("username")) {
    open.value = true;
  }
});
</script>

<style scoped>
:where(.css-dev-only-do-not-override-16pw25h).ant-col-8 {
  max-width: 10% !important;
}
</style>