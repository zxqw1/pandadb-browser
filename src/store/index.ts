
import { createLogger, createStore, type StoreOptions } from 'vuex'
// import { reactive,toRaw } from 'vue';
// 需要实时更新
const store: StoreOptions<any> = {
    state: {
        list: []
    },
    mutations: {
        increment(state: any, value) {
            // console.log(value,11)
            // 删除
            if (value.type === "remove") {
                // console.log(value,15)
                // console.log(state.list,16)
                // state.list.forEach(item=>{
                //     console.log(item,18)
                // })
                state.list = state.list.filter((item: any) => {
                    return item.item.id !== value.value.item.id
                });
                console.log(state.list,16)
            } else {
                // 添加到数组的最前
               state.list.unshift(value)
                // if (state.list.length === 30) {
                //     // 删除最下方
                //     state.list.pop()
                // }
                // console.log(state.list,"24")
            }
        }
    },
    
    actions: {
        increment({ commit }, value) {
        //    console.log(value,30)
        }
    },
    plugins: [createLogger()]
};

export default createStore(store);