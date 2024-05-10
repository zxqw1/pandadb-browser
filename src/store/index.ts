
import { createLogger, createStore, type StoreOptions } from 'vuex'
import { reactive } from 'vue';
// 需要实时更新
const store: StoreOptions<any> = {
    state: reactive({
        list: [],
    }),
    mutations: {
        increment(state: any, value) {
            // console.log(value)
            store.state.list.unshift(value)
            // console.log(store.state.list,12)
            console.log(store.state.list.length)
            if(store.state.list.length === 30){
                store.state.list.pop()
            }
        }
    },
    actions: {
        increment({ commit }, value) {
            commit('increment', value);
            // console.log(value,"53")
        }
    },
    plugins: [createLogger()]
};

export default createStore(store);