
import { createLogger, createStore, type StoreOptions } from 'vuex'
import { reactive } from 'vue';
// 需要实时更新
const store: StoreOptions<any> = {
    state: reactive({
        list: [],
    }),
    mutations: {
        increment(state: any, value) {
            // 删除
            if (value.type === "remove") {
                store.state.list = store.state.list.filter((item: any) => {
                    return item.id !== value.value.id
                });
                // console.log(store.state.list,"19") 
            } else {
                // 添加到数组的最前
                store.state.list.unshift(value)
                if (store.state.list.length === 30) {
                    // 删除最下方
                    store.state.list.pop()
                }
            }
        }
    },
    actions: {
        increment({ commit }, value) {
            // commit('increment', value);
            // console.log(value,"53")
        }
    },
    plugins: [createLogger()]
};

export default createStore(store);