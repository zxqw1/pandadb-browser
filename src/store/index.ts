
import { createLogger, createStore, type StoreOptions } from 'vuex'

const store: StoreOptions<any> = {
    state: {
        list: [],
        topList:[]
    },
    mutations: {
        increment(state: any, value) {
            // console.log(value,"value")
            value.show = true
            state.list.push(value)
            // console.log(state.list,'添加新的元素后的数组')
        },
        //删除
        remove(state, index) {
            state.list.splice(index, 1)
            // console.log(state.list, '删除后的数组')
        },
        remove2(state, index) {
            state.topList.splice(index, 1)
            // console.log(state.list, '删除后的数组')
        },
        //置顶
        top(state, data2) {
            data2.item.show = true
            state.list.splice(data2.index, 1)
            state.topList.push(data2.item)
            console.log(state.topList,'30')
        },
        top2(state, data3) {
            // console.log(data3.item,'item')
            state.topList.splice(data3.index, 1)
            state.list.push(data3.item)
            console.log(state.list,'36')
        },
        //修改
        revise(state, data) {
            data.result.show = true
            state.list[data.index] = data.result
        }
    },
    actions: {
        increment({ commit }, value) {
            commit('increment', value); // 提交 mutation 来改变状态  
        },
        remove({ commit }, index) {
            commit('remove', index);
        },
        remove2({ commit }, index) {
            commit('remove', index);
        },
        top({ commit }, data2) {
            commit('top', data2);
        },
        top2({ commit }, data3) {
            commit('top', data3);
        },
        revise({ commit }, data) {
            commit('revise', data);
        }
    },
    plugins: [createLogger()]
};

export default createStore(store);