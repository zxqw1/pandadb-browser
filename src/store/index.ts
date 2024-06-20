
import { createLogger, createStore, type StoreOptions } from 'vuex'

const store: StoreOptions<any> = {
    state: {
        list: []
    },
    mutations: {
        increment(state: any, value) {
            console.log(value,"10")
            state.list.push(value)
            console.log(state.list,'添加新的元素后的数组')
        },
        //删除
        remove(state, index) {
            state.list.splice(index,1) 
            console.log(state.list, '删除后的数组')
        }
    },

    actions: {
        increment({ commit }, value) {
            commit('increment', value); // 提交 mutation 来改变状态  
        },
        remove({commit},removeList){
            commit('remove', removeList);
        }
    },
    plugins: [createLogger()]
};

export default createStore(store);