
import { createLogger, createStore, type StoreOptions } from 'vuex'

const store: StoreOptions<any> = {
    state: {
        list: []
    },
    mutations: {
        ScrollChange(state: any, value) {
            console.log(value,"10")
            state.list.push(value)
            // let num = undefined;
            // for (let i = 0; i < state.list.length; i++) {
            //     if (state.list[i].length === 0) {
            //         num = i;
            //         break;
            //     }
            // }
            // value.show = true
            // if (num !== undefined) {
            //     state.list[num] = [value]
            // }
            // sessionStorage.setItem("reviseNum", JSON.stringify(-1))
        },
        //删除
        // remove(state, index) {
        //     state.list.splice(index, 1)
        //     state.list.push([])
        // },
        // remove2(state, index) {
        //     state.toplist.splice(index, 1)
        //     state.toplist.push([])
        // },
        // //置顶
        // top(state, data2) {
        //     data2.item.show = true
        //     state.list.splice(data2.index, 1)
        //     let num2 = undefined
        //     for (let k = 0; k < state.toplist.length; k++) {
        //         if (state.toplist[k].length === 0) {
        //             num2 = k;
        //             break
        //         }
        //     }
        //     data2.item.show = true
        //     if (num2 != undefined) {
        //         state.toplist[num2] = data2.item
        //     }
        // },
        // top2(state, data3) {
        //     state.toplist.splice(data3.index, 1)
        //     let num3 = undefined;
        //     for (let t = 0; t < state.list.length; t++) {
        //         if (state.list[t].length === 0) {
        //             num3 = t;
        //             break;
        //         }
        //     }
        //     if (num3 !== undefined) {
        //         data3.item.show = false
        //         state.list[num3] = data3.item
        //     }

        // },
        // //修改
        // revise(state, data) {
        //     data.result.show = true
        //     state.list[data.index][0] = data.result
        //     state.obj2 = {
        //         rootId: data.index,
        //         nodes: [],
        //         lines: [],
        //     }
        //     data.result.records.map((item: any) => {
        //         let textName = "";
        //         let textTitle = "";
        //         if (
        //             item.keys.indexOf("n") !== -1 &&
        //             item.keys.indexOf("p") === -1 &&
        //             item._fields[item.keys.indexOf("n")] &&
        //             item._fields[item.keys.indexOf("n")].elementId &&
        //             item._fields[item.keys.indexOf("n")].properties
        //         ) {
        //             for (const key in item._fields[item.keys.indexOf("n")].properties) {
        //                 textName = item._fields[item.keys.indexOf("n")].properties[key];
        //             }
        //             state.obj2.nodes.push({
        //                 id: item._fields[item.keys.indexOf("n")].elementId,
        //                 text: textName,
        //                 color: "#21a1ff",
        //             });
        //         } else if (
        //             item.keys.indexOf("p") !== -1 &&
        //             item._fields[0] &&
        //             item._fields[item.keys.indexOf("p")].end &&
        //             item._fields[item.keys.indexOf("p")].start
        //         ) {
        //             for (const key in item._fields[item.keys.indexOf("p")].start
        //                 .properties) {
        //                 textName = item._fields[item.keys.indexOf("p")].start.properties[key];
        //             }
        //             for (const key in item._fields[item.keys.indexOf("p")].end.properties) {
        //                 textTitle = item._fields[item.keys.indexOf("p")].end.properties[key];
        //             }
        //             state.obj2.nodes.push({
        //                 id: item._fields[item.keys.indexOf("p")].start.elementId,
        //                 text: textName,
        //                 color: "#21a1ff",
        //             });
        //             state.obj2.nodes.push({
        //                 id: item._fields[item.keys.indexOf("p")].end.elementId,
        //                 text: textTitle,
        //                 color: "#21a1ff",
        //             });
        //             state.obj2.lines.push({
        //                 from: item._fields[item.keys.indexOf("p")].start.elementId,
        //                 to: item._fields[item.keys.indexOf("p")].end.elementId,
        //                 text: item._fields[item.keys.indexOf("p")].segments[0].relationship
        //                     .type,
        //                 color: "#666666",
        //             });
        //         } else {
        //         }

        //     })
        //     sessionStorage.setItem("reviseNum", JSON.stringify(data.index))
        // }
    },
    actions: {
        ScrollChange({ commit }, value) {
            commit('ScrollChange', value); // 提交 mutation 来改变状态  
        },
        // remove({ commit }, index) {
        //     commit('remove', index);
        // },
        // remove2({ commit }, index) {
        //     commit('remove', index);
        // },
        // top({ commit }, data2) {
        //     commit('top', data2);
        // },
        // top2({ commit }, data3) {
        //     commit('top', data3);
        // },
        // revise({ commit }, data) {
        //     commit('revise', data);
        // }
    },
    plugins: [createLogger()]
};

export default createStore(store);