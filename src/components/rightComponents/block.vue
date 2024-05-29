<template>
  <div :class="name"  v-for="(item, index) in list" :key="index" style="display: flex; flex-direction: column;">
    <!-- 右上 -->
    <div class="topIcon">
      <PushpinOutlined style="margin-left: 16px" />
      <UpOutlined
        :key="index"
        style="margin-left: 16px"
        @click="retract(item)"
        v-if="!islaunch"
      />
      <DownOutlined style="margin-left: 16px" @click="retract(item)" v-else/>
      <ExpandAltOutlined
        style="margin-left: 16px"
        @click="toggleFullScreen"
        v-if="!isFullscreen"
      />
      <ShrinkOutlined
        style="margin-left: 16px"
        @click="toggleFullScreen"
        v-else
      />
      <CloseOutlined style="margin-left: 16px" @click="removeModule(item)" />
    </div>
    <!-- 输入框 -->
    <div class="search">
      <div class="bgSearch">
        <img
          src="../../assets/img/logos.png"
          alt=""
          style="
            position: absolute;
            z-index: 1;
            width: 46px;
            height: 30px;
            top: 1%;
          "
        />
        <a-textarea
          v-model:value="value1"
          placeholder="请输入"
          auto-size
          style="
            background-color: #f6f6f6;
            border: 1px #d2dabb dashed;
            padding: 0 38px;
            width: 100%;
          "
        />
        <CaretRightOutlined
          style="font-size: 24px; color: #6a8322; position: absolute; right: 1%"
        />
      </div>
      <StarOutlined style="font-size: 20px; color: #666666" />
      <VerticalAlignBottomOutlined style="font-size: 24px" />
    </div>
    <!-- 关系图 -->
    <div  style="flex: 3;">
      <!-- {{ item.result }} -->
      <node :data=" { item } " style="height:100% ;" :v-if="item.type === 'result'"/>  
    </div>
  </div>
</template>

<script setup lang="ts">
import node from "./graph/node.vue";
import { useStore } from "vuex";
import { ref, computed,watch } from "vue";
// 导入icon
import {
  PushpinOutlined,
  DownOutlined,
  ExpandAltOutlined,
  CloseOutlined,
  StarOutlined,
  CaretRightOutlined,
  VerticalAlignBottomOutlined,
  ShrinkOutlined,
  UpOutlined,
} from "@ant-design/icons-vue";
const store = useStore();
// const list = computed(() => store.state.list)
const list = ref(store.state.list)
const value1 = ref<string>("");
value1.value = 'MATCH (n) RETURN n LIMIT 10'
// 输入框数据
const isFullscreen = ref<boolean>(false);
const islaunch = ref<boolean>(false);
const name = ref<string>("block"); //默认效果


watch(store.state.list, (newValue, oldValue) => {
   list.value = store.state.list
   value1.value = 'MATCH (n) RETURN n LIMIT 10'
  //  console.log(store.state.list)
});
// console.log(list.value,96)

// 收起
// const retract = (value: any) => {
//   value.isShowFlag = !value.isShowFlag
//   if(value.isShowFlag === true){
//   islaunch.value = !islaunch.value;
//   }
//   if ( islaunch.value === true) {
//     name.value = "launch"; //收起后类名变成这个
//   } else {
//     name.value = "block";
//   }
// };
// 放大
const toggleFullScreen = () => {
  isFullscreen.value = !isFullscreen.value;
  if (isFullscreen.value === true) {
    name.value = "FullScreen"; //全屏后类名变成这个
  } else {
    name.value = "block";
  }
};
// 删除
// 有问题待解决（同类型删除）
const removeModule = (value: any) => {
  // console.log(value, "38");
  store.commit("increment", { type: "remove", value })  

};
</script>
<style scoped>
.launch {
  width: 100%;
  height: 100px;
  background-color: #ffffff;
  position: relative;
  margin-top: 24px;
}
.FullScreen {
  background-color: #ffffff;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  margin: 0;
  z-index: 2;
}
.block {
  height: 424px;
  width: 100%;
  background-color: #ffffff;
  position: relative;
  margin-top: 24px;
}
.CaretRightOutlined {
  width: 50px;
  height: 50px;
}
.search {
  width: 100%;
  background-color: #ffffff;
  padding: 18px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;
}
.bgSearch {
  position: relative;
  width: 93%;
  display: flex;
  align-items: center;
  /* background-color: #ffffff; */
}
.topIcon {
  padding: 0 16px;
  position: absolute;
  top: 10px;
  right: 0;
}
</style>

