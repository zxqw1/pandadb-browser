
import { createLogger, createStore, type StoreOptions } from 'vuex'

const store: StoreOptions<any> = {
    state: {
        list: []
    },
    mutations: {
        increment(state: any, value) {
            // console.log(value,11)
            state.list.unshift(value)
        }
    },
    
    actions: {
        increment({ commit }, value) {
            commit('increment', value); // 提交 mutation 来改变状态  
        }  
    },
    plugins: [createLogger()]
};

export default createStore(store);