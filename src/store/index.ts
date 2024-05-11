
import { createLogger, createStore, type StoreOptions } from 'vuex'
import { reactive } from 'vue';
// 需要实时更新
const store: StoreOptions<any> = {
    state: reactive({
        list: [],
    }),
    mutations: {
        increment(state: any, value) {
            // console.log(value,"11")
            if(value.type === "remove"){
                store.state.list = store.state.list.filter((item: any) => {
                    // console.log(item,"14")
                    // console.log(value.value,"15")
                    // return item === value.value;
                    return item !== value.value
                });
            }else{
                // 添加到数组的最前
                store.state.list.unshift(value.value)
                if(store.state.list.length === 30){
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