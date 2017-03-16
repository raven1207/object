<template>
  <div>


    <!--搜索条-->
    <div class="search-wrapper">

      <div class="wrapper" :class="{fn_search_z:maskShow}">
        <div class="fn_list_searchBar top_box set">
          <span class="top_back back J_back" @click="backNextpage"></span>
          <form class="set_ip search_box" action="javascript:void(0);">
            <i class="iconfont J_srch_submit">&#xe60f;</i>
            <!--凑单页输入-->
            <input class="inputid" v-if="urlQuery" type="text" placeholder="在结果中搜索" v-model.trim="msg"
                   :value="keys"
                   @keyup="msgInput($event)" @focus="msgInput($event)">
            <!--搜索页输入-->
            <input v-else type="text" placeholder="搜索商品" v-model.trim="msg" :value="keys"
                   @keyup="msgKeyup($event)" @focus="msgKeyup($event)" class="inputid">
            <span class="close iconfont" v-show="closeIconShow" @click="clearInputMsg">&#xe66a;</span>
          </form>
          <div class="J_sx choice" @click.stop="filterShow">筛选</div>
          <span class="iconfont tab_nav" :class="{active:isActive}" @click="changeImagePattern">&#xe684;</span>
        </div>
      </div>

      <slot></slot>
      <!--搜索出现蒙层-->
      <div class="fn_search_mask" :class="{fn_mask_z:maskShow}" v-show="maskShow" @click="popupBtn"></div>
      <list-search-suggestion v-show.sync="searchSuggestShow"
                              :msg="msg" :suggest-data="suggestDataFilter" @suggestion-obj="suggestionObj"></list-search-suggestion>
    </div>
    <!--公共头部-->
    <fn-top-nav :class="{showNav:showNav}"></fn-top-nav>
  </div>
</template>

<script>

  import {mapMutations, mapState} from 'vuex'
  import fnAppdown from "../common/fn-appdown.vue";
  import listSearchSuggestion from './fn-search-suggestion';
  import * as listServices from '../../services/listService';


  //顶部 导航
  import fnTopNav from "../common/fn-top-nav";

  export default{

    props: {
      bodyFilters: Array
    },
    data(){
      return {
        msg: '',
        suggestData: [],
        maskShow: false,
        initKey: false,
        isActive: false,
        showNav: false,             //展示顶部导航 开关
        searchSuggestShow: false   //是否展示搜索结果 开关
      }
    },
    mounted(){
      if (this.$route.name === "searchPage") {
        this.setKeysChange(this.$route.query.kw.replace('+', ' '));
      }
    },
    computed: {
      ...mapState({
        isListFilter: state => state.list.isListFilter,
        keys:state=>state.list.keys
      }),
      showCloseIcon(){
        return this.msg != '';
      },
      urlQuery(){
        return this.$route.query.fdlSeq ? true : false;
      },
      closeIconShow(){
        let flag = this.msg != '' ? true : false;
        if (this.initKey) {
          if (!flag) {
            this.searchSuggestShow = false;
          }
          return flag;
        } else {
          return false;
        }

      },
      suggestDataFilter(){
        //数据预处理
        return this.suggestData.filter(function (obj) {
          if (obj.customKeyword || obj.campaign) {
            if (obj.customKeyword && obj.customKeyword.length === 1) {
              return true
            }
            return false;
          }
          return true;
        });
      },
      //获得是否是 馆页, cateid
      getCategory(){
        let obj = {};
        if (this.$route.params.cate) {
          obj.cateid = this.$route.params.cate;
          obj.isCategory = true;
        } else {
          obj.cateid = "";
          obj.isCategory = false;
        }
        return obj;
      }
    },
    methods: {
      ...mapMutations({
        toggleState: 'TOGGLE_TARGET_STATE',
        setMaskShow: 'SET_MASK_SHOW',
        setKeysChange:'SET_KEYS_CHANGE'
      }),
      //搜索框埋点公共方法
      searchStat(e){
        if (e.type == "focus") {
          $.stat.shangbao({
            track_tag_name: '2001',
            track_type: '2'
          });
        } else {
          this.initKey = true;//初始化时触发时才显示叉按钮
        }
      },
      backNextpage(){
        window.history.go(-1)
      },
      changeImagePattern(){
        this.isActive = !this.isActive
        this.showNav = !this.showNav
      },
      //搜索框中回车
      doSearchEvent(){

        //回车先关闭 搜索结果
        this.searchSuggestShow = false;

        if (this.msg === "") {
          $.toast("搜索关键字不能为空");
        } else {
          //关键字不为空的时候,进行搜索

        }
      },

      //搜索为空时回车提示
      inputEmpty(){
        $.toast({
          message: '搜索关键字不能为空',
          position: 'center',
          duration: 1500
        });

      },
      //搜索输入事件行为
      inputEvents(){
        let self = this;
        let params = {
          body: {
            keywords: self.msg
          }
        };
        this.initKey = false;//初始化时触发时才显示叉按钮
        $('.inputid').blur(); //回车后光标失去焦点
        self.getRequestLink(params);//飞牛密令跳转
        self.$emit('search-event', self.msg);//回来请求搜索框内容
        //点击搜索框加入埋点
        $.stat.shangbao({
          track_tag_name: '2001',
          track_type: '2'
        });
      },
      //凑单页输入
      msgInput(e) {
        let self = this;
        this.initKey = true;//初始化时触发时才显示叉按钮
        this.maskShow = true;  //凑单页蒙层展示
        //app下载层级变高展示出来
        this.setMaskShow(true);
        self.searchStat(e); //调用埋点
        if (self.msg === '') { //输入内容为空点回车的动作
          if (e && e.keyCode == 13) {
            self.inputEmpty();
          }
          return;
        } else if (e && e.keyCode == 13) {//兼容手机浏览器enter键
          this.maskShow = false; //蒙层隐藏
          this.setMaskShow(false);//重置默认的样式层级
          this.inputEvents(); //调用输入事件
        }
      },
      //搜索页输入事件
      msgKeyup(e){
        const self = this;
        self.searchStat(e);
        if (this.getCategory.isCategory) {
          self.setKeysChange("");
        } else {
          this.$route.query.kw ? this.$route.query.kw.replace('+', ' ') : "";
        }

        let data = {
          body: {
            keyword: self.msg
          }
        };
        if (self.msg === '') {
          if (e && e.keyCode == 13) {
            self.inputEmpty();
          }
          return;
        } else if (e && e.keyCode == 13) {//兼容手机浏览器enter键
          self.searchSuggestShow = false;
          self.inputEvents();
          return;
        }
        listServices.getSearchSuggestion(data).then((res) => {
          if (res.code == 0 && res.data) {
            this.searchSuggestShow = true;
            if (res.data.Keywords) {
              this.suggestData = this.preDealSuggest(res.data.Keywords);
            }
          }
        }, function (res) {
          console.log('请求搜索结果接口失败');
        });
      },
      getRequestLink(data){
        listServices.getLink(data).then((res)=> {
          if (res.errorCode === 0 && res.isActivity == 1) {
            window.location.href = res.link;
          }
        }, (res)=> {
          console.log(res);
        });
      },
      popupBtn(){
        this.maskShow = false;
        this.setMaskShow(false);
        //app下载层级变高展示出来
        this.setMaskShow(true);
      },
      getSearch(msg, cate){
        this.$emit('search-event',msg,cate);//回来请求搜索框内容
        this.msg = msg;
        this.cate = cate;
      },
      //处理接口返回的数据,将categoryList拆分
      preDealSuggest(arr){
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].categoryList && arr[i].categoryList.length > 0) {
            let categoryArr = [{
              categoryList: [],
              content: arr[i].content,
              displayTitle: arr[i].displayTitle,
              keyword: arr[i].keyword,
              type: arr[i].type
            }];
            for (let k = 0; k < arr[i].categoryList.length; k++) {
              categoryArr.push({
                categoryList: [{
                  cp_name: arr[i].categoryList[k].cp_name,
                  cp_seq: arr[i].categoryList[k].cp_seq
                }],
                content: arr[i].content,
                displayTitle: arr[i].displayTitle,
                keyword: arr[i].keyword,
                type: arr[i].type
              });
            }
            arr.splice(i, 1, ...categoryArr);
            i = i + categoryArr.length;
            categoryArr = [];
          }

        }
        return arr;
      },
      /*点击搜索框中的清除按钮，清除input内容*/
      clearInputMsg(){
        this.msg = '';
      },
      /*点击筛选按钮*/
      filterShow(){
//        this.$dispatch('other-close');//关闭其它组件里打开的弹层
        this.searchSuggestShow = false;
        // this.show  = true;
        document.querySelector('body').classList.add('hideOverflow')
        document.querySelector('html').classList.add('hideOverflow')
        this.toggleState({target: this.$store.state.list, key: 'isListFilter'})
         this.$emit('child-search');
        //卖场列表页点击筛选加入埋点
        $.stat.shangbao({
          track_tag_name: '2009',
          page_content: this.$route.query.kw || this.$route.params.cate,
          track_type: '2'
        });
      },
      suggestionObj(queryObj){
        this.searchSuggestShow = false;
        this.getSearch(queryObj.key, queryObj.cate);
      }
    },
    components: {
      fnAppdown,
      listSearchSuggestion,
      fnTopNav
    }
  }

</script>

<style>
  .hideOverflow {
    overflow: hidden;
  }

  .good_search {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .set > * {
    display: block;
  }

  .set .tab_nav {
    padding-right: .24rem;
    font-size: .36rem;
  }

  .set .J_sx {
    white-space: nowrap;
    margin: .1rem;
  }

  .J_srch_submit {
    font-size: .4rem;
    color: #888;
    position: absolute;
    left: 8px;
    top: 4px;
    z-index: 9999;
  }

  .fn_list_container .icon_tab_name {
    padding-right: 0.24rem;
  }

  .fn_list_container .active {
    color: rgb(194, 0, 83);
  }



