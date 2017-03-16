/**
 * Created by KE on 16/12/9.
 */
//
import {
  fetchSMbyKey,
  fetchSmByCategory,
  fetchDetails,
  fetchSearchSuggestion,
  fetchCateTree
} from './listApi';

import {
  getAddressList,
  getNextAddress
} from '../../../services/addressService'

import * as types from './mutation-types'

/**
 * 列表页
 * 搜索页
 * 分类页
 * store 状态管理仓库
 * @type {Vuex.Store}
 */
const store = {
  state: {
    isInitData: true, //首次刷新页面
    desByPrice: null, //是否价格排序 null:没有排序 0:升序  1:降序

    bodyFilters: [], //条件选择数据
    merchandiseList: [], //商品列表数据
    selectListData: [], //三级下拉数据
    category: [], //分类列表
    bodyData: {}, //数据对象
    salesData: [], //促销
    listData: [],
    suggestData: [],
    freshData:[], //生鲜状态提示数据
    noShop: false, //每次进来从新定义没有相应的商品放大镜提示

    currentPage: 1, //当前第几页
    totalPageSize: 1, //一共多少页
    bigImagePattern: false, //大图模式 or 列表模式  (默认列表模式)

    isListFilter: false, //是否显示右侧筛选条件

    noMoreCount: false, //没有更多
    topLoading: false, //头部加载刷新
    loadingAll: false, //全局加载刷新
    bottomLoading: false, //底部加载更多

    addressObj: {
      addrTopList: [],
      addressList: [],
      cityList: [],
      areaList: []
    },
    showAddress: false, //显示地址分类
    maskShow: false, //头部下载样式层级控制
    keys:''
  },
  /**
   * vuex 2.0 action should be await
   */
  actions: {
    fetchSearchDataAction: ({commit, dispatch}, options) => {
      commit('SET_TOP_LOADING', {type: true})

      fetchSMbyKey({body: options.body}).then((res) => {

        if (res.code === 0) {
          console.log(res.data)
          let isRefresh = typeof(options.isRefresh) == 'undefined' ? true : options.isRefresh

          dispatch('renderPage', {...res.data, isRefresh})

          // dispatch('fetchCateTreeAction', res.data.cateTreeParams)

          commit('RENDER_BASIC_INFO', res.data)

          if (res.data.MerchandiseList.length === 0) {

            commit('RENDER_STATUS_NO_COUNT', {noShop: true})
            commit('SET_TOP_LOADING', {type: false})

          } else {

            dispatch('fetchMlistDetailAction', res.data.MerchandiseList)

          }

        } else {

          commit('RENDER_STATUS_NO_COUNT', {noShop: true})

        }
      }, (res) => {

        $.toast(res | "获取详细数据接口出错")

      })
    },
    /**
     * 获取馆页数据 {列表,头部,筛选}
     * @param commit,options
     */
    fetchSmByCategoryAtion: ({commit}, options) => {
      fetchSmByCategory(options)
        .then(res => {

          if (res.code === 0) {

          } else {

          }

        }).catch(res => {
        $.toast("fetchSmByCategoryAtion 失败");
      })
    },
    /**
     * 根据首屏基础数据,获取真实的 列表详情,打标,价格可卖量     等等信息
     * @param commit,options
     * @returns {*}
     */
    fetchMlistDetailAction: ({commit, state}, options) => {

      fetchDetails(options.map(item => {

        return item.item_id;

      }), state.desByPrice)

        .then(res => {

          if (res.code === 0) {

            commit("COMBINE_DETAIL_LIST", res.data);
            commit('FRESH_DATA',res.data);
            commit('SET_TOP_LOADING', {type: false});
          } else {

            $.toast(res.msg || "获取详细数据接口出错")

          }
        }).catch(res => {

        $.toast(res.msg || "fetchMlistDetailAction 失败");

      })
    },
    /**
     * 获取全部分类
     * @param commit,options
     */
    fetchCateTreeAction: ({commit}, options) => {

      fetchCateTree(options)

        .then(res => {

          if (res.code === 0) {
            commit('RENDER_CATEGORY_LIST', res.data)
          } else {

          }

        }).catch(res => {

        $.toast("fetchCateTreeAction 失败");

      })
    },
    /**
     * 获取搜索建议信息
     * @param commit
     * @param options
     * @returns {*}
     */
    fetchSearchSugAction: ({commit}, options) => {

      fetchSearchSuggestion(options)

        .then(res => {

          if (res.code === 0) {

          } else {

          }

        }).catch(res => {

      })
    },
    /**
     * 获取分类里查询二级菜单
     * @param cateTreeParams
     */
    fetchMenuAction({commit}, options){
      //是否是馆页
      if (options.isCate) {
        dispatch('fetchSmByCategoryAtion', options.params)
          .then((res) => {
            if (res.code === 0) {
              // let {filter}=res.data;
              //渲染二级菜单
              // this.renderFilterData(filter || [], isCateData);
            } else {
              // this.renderFilterData([]);
            }
          }, (res) => {
            console.log(res.msg)
          })
      } else {
        dispatch('fetchSearchDataAction', options.params)
          .then((res) => {
            if (res.code === 0) {
              console.log('=======' + res + '=======')
              // let {filter}=res.data;
              //渲染二级菜单
              // this.renderFilterData(filter || [], isCateData);
            } else {
              // this.renderFilterData([]);
            }
          }, (res) => {
            console.log(res)
          })
      }
    },
    renderPage: ({commit, state}, {sortParamList, filter, MerchandiseList, similarKeywords, isRefresh}) => {

      if (isRefresh && state.isInitData) {

        commit('RENDER_SORT_PARAM', sortParamList || [])

        commit('RENDER_FILTER_DATA', filter || [])

      }

      commit('SET_BOTTOM_LOADING', {type: false})
      commit('RENDER_LIST_DATA', {MerchandiseList, similarKeywords, isRefresh})

    },
    fetchAddressList: ({commit}, {used}) => {
      getAddressList({body: used}).then((res) => {

        if (res.errorCode == 0) {
          let data = res.body;
          console.log(res)
          commit('RENDER_ADDRESS_DATA', data)
          // self.render({address: data.AddrList}); //接口请求成功
        }
      }, (res) => {
        console.log(res)
      })
    },
    fetchNextAddress: ({commit}) => {
      // getNextAddress().then((res) => {

      // }, (res) => {
      //     console.log(res)
      // })
    }

  },

  /**
   * even vuex 2.0 mutations should be async
   */
  mutations: {

    [types.COMBINE_DETAIL_LIST](state, res) {

      let cloneMerchandiseList = [];

      state.merchandiseList.forEach(item => {

        cloneMerchandiseList.push(Object.assign({}, item, res[item.sm_seq]));

      })
      //combine 合并基础对象和详细属性,重现渲染列表
      state.merchandiseList = cloneMerchandiseList;
    },
    [types.FRESH_DATA](state,res){
      state.freshData=res;
    },
    [types.RENDER_LIST_DATA](state, {MerchandiseList, similarKeywords, isRefresh}) {

      state.isInitData = false

      state.noMoreCount = MerchandiseList.length > 0 && MerchandiseList.length < 10
        ? true : false

      if (isRefresh) {
        //页面切换，刷新数据重新赋值
        state.merchandiseList = MerchandiseList;

        similarKeywords && similarKeywords.length > 0 && state.merchandiseList.push({
          similarKeywords: similarKeywords
        });

      } else {

        //下拉加载追加数据
        similarKeywords && similarKeywords.length > 0 && state.merchandiseList.push({
          similarKeywords: similarKeywords
        });

        state.merchandiseList = state.merchandiseList.concat(MerchandiseList);

      }
    },
    [types.RENDER_FILTER_DATA](state, filter) {

      state.bodyFilters.length = 0;

      if (filter.length !== 0) {
        filter[1].children.forEach(item => {
          item.isSelected = false; //针对筛选头部主题选择按钮增加属性状态
        });
      }

      if (filter[2] && filter[2].children.length > 0) { //获取二级菜单
        filter[2].children.forEach(item => {
          if (item.at_name && item.is_quick === 1) { //二级菜单显示条件限制的个数
            item.active = false;
            item.isAll = true;
            item.falseAll = true; //二级菜单下拉假全部按钮属性状态识别
            item.isTabActive = false;
            item.child.forEach(temp => {
              temp.isSelected = false;
              temp.falseSelected = false; //二级菜单下拉假列表属性状态识别
              temp.popupSelected = false; //筛选弹层里的二级菜单列表下拉选择状态
            })
          }
        })
      }

      state.bodyFilters = filter; //筛选内容数据
    },

    [types.RENDER_SORT_PARAM](state, sortParamList) {

      state.selectListData.length = 0;
      state.salesData.length = 0;
      state.listData.length = 0;

      for (let j of sortParamList) {
        if (j.sortType !== -1) {
          j.isActive = false;
          if (j.sortType == 1) {
            j.isActive = true; //初始化默认值　
            //综合下拉列表数据处理
            j.children.forEach(item => {
              item.isSelect = false;
              if (item.sortType == 1) {
                item.isSelect = true; //初始化默认值　
              }
              state.selectListData.push(item);
            })
          }
          state.listData.push(j);
        } else {
          //促销
          j.isSales = false;
          state.salesData.push(j)
        }
      }
    },

    [types.RENDER_CATEGORY_LIST](state, category) {

      if (category.length <= 0) return;

      category.forEach((item, index) => {
        if (index == 0) {
          item.allCate = true; //为全部分类默认初始化个属性
        }
        item.isOpen = false;
        if (index == 1) {
          item.isOpen = true; //分类列表第一列默认展开状态
        }
        if (item.children) {
          item.children.forEach(cate => {
            cate.isRadio = false;
          });
        }
      });

      state.category = (category.length >= 1) ? category : [];
    },
    [types.SET_MERCHANDISELIST_LIST](state, {MerchandiseList}) {

      state.merchandiseList = MerchandiseList

    },
    [types.RENDER_STATUS_NO_COUNT](state, {noShop}){

      state.noShop = noShop
      // nomore
      // showlist
      // merchandiseList.length

    },
    [types.RENDER_BASIC_INFO](state, res) {
      state.totalPageSize = res.totalPageCount
    },
    [types.SET_BOTTOM_LOADING](state, payload) {

      state.bottomLoading = payload.type

    },
    [types.SET_MASK_SHOW](state, show){
      state.maskShow = show;
    },
    [types.SET_KEYS_CHANGE](state,key){
      state.keys= key;
    },
    [types.SET_TOP_LOADING](state, payload) {

      state.topLoading = payload.type

    },
    [types.SET_ALL_LOADING](state, payload) {

      state.loadingAll = payload.type

    },
    /**
     * 切换筛选方式
     */
      [types.CHANGE_FILTER_TYPE](state, {target, item, key}) {
      target.forEach(temp => {
        temp[key] = temp == item ? true : false
      })

    },
    /**
     * 更新目标状态指定值
     */
      [types.UPDATE_ASSIGNED_STATE](state, {target, key, value}) {
      target[key] = value
    },
    /**
     * 切换目标布尔状态
     */
      [types.TOGGLE_TARGET_STATE](state, {target, key}){
      target[key] = !target[key]
    },
    /**
     * Tab states切换显示
     */
      [types.CHANGE_TABS_STATE](state, {target, item, key}){
      if (item) {
        item[key] = !item[key]
      }
      target.forEach(temp => {
        if (temp !== item) {
          temp[key] = false
        }
      })
    },
    [types.TRANS_FILTER_CONDITIONS](state, {target}){
      target.forEach(item => {
        item.child.forEach(temp => {
          temp.isSelected = temp.popupSelected = temp.falseSelected ? true : false
        })
        item.isAll = item.falseAll ? true : false
      })
    },
    [types.RENDER_ADDRESS_DATA](state, data){
      let arrObj = [];//选择其他地址数据
      //常用地址增加状态属性
      if (data.address) {
        data.address.forEach(item=> {
          item.isSelected = false;
        })
      }
      data.address && data.address.length !== 0 ? state.addrTopList = data.address : [];   //常用收货地址数据
      //其它地址增加状态属性
      if (data.listAddress) {
        data.listAddress.forEach(item=> {
          item.isSelected = false;
        })
      }
      data.listAddress && data.listAddress.length !== 0 ? arrObj = data.listAddress : []; //选择其他地址数据

      if (data.arrNum == 1) {
        state.addressList = arrObj;
      } else if (data.arrNum == 2) {
        state.cityList = arrObj;
      } else {
        state.areaList = arrObj;
      }

    }
  },

  getters: {
    /* 获取综合下拉选中 */
    listDownType: (state) => {
      let type = ''
      state.selectListData.filter(item => {
        if (item.isSelect) {
          type = item.sortType
        }
      })
      return type
    }
  }
}

export default store
