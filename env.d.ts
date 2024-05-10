/// <reference types="vite/client" />

declare module "*.vue" { // 因为.vue文件是一个Vue组件，而TypeScript默认不理解Vue单文件组件（SFC）的语法。所以加入以下代码解决问题
    import type { DefineComponent } from "vue";
    const vueComponent: DefineComponent<{}, {}, any>
    export default vueComponent
}
declare module "vuex" {
    export * from "vuex/types/index.d.ts";
    export * from "vuex/types/helpers.d.ts";
    export * from "vuex/types/logger.d.ts";
    export * from "vuex/types/vue.d.ts";
}