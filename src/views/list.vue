<template>
  <div class="outbox app-nav fn_list_container" style="position:relative">
    <div class="head_f">
      <!--加载全部-->
      <p v-show="loadingAll" class="loading_pop all"><b></b></p>
      <!-- 头部 筛选 品牌 -->
      <fn-head-box>
        <fn-appdown :app-url="dealAppUrl"></fn-appdown>
        <fn-search :body-filters="bodyFilters" @toggle-open="toggleTab" @search-event="searchEvent" @child-search="childSearch">
          <!--排序 筛选 条件-->
          <fn-list-filter :body-filters="bodyFilters" :show.sync="defaultConfig.show"
                          :show1.sync="defaultConfig.show1" @condition-query="typeChange"
                          :fresh-show-cate="freshShowCate"
                          :category-list="category"
          />
          </fn-search>
          <!-- 品牌 -->
          <fn-list-top :body-filters="bodyFilters"
                       @condition-query="typeChange"
          />

          <p v-show="topLoading" class="loading_btm"><b></b><i>正在努力刷新数据中...</i></p>
      </fn-head-box>
      <!-- 修正词-->
      <!--             <div class="no_product2" id="J_no_product" v-show="recKeyword">
                      <img src="~assets/images/default/nofound.png">
                      <div>
                          <h3>抱歉，没有找到相应商品</h3>
                          <p>为您显示<span>{{recKeyword}}</span>的相关商品</p>
                      </div>
                  </div> -->

      <!--列表页-->
      <fn-list-page :merchandise-list="merchandiseList"
                    :page-size="onePageSize"
                    :no-shop="noShop"
                    @search-event="searchEvent"/>
      <!--没有找到相应的商品  S-->
      <div class="">
        <div class="no_find_shop" v-if="noShop">
          <i class="iconfont">&#xe60f;</i>
          <p>对不起,没有找到相应的商品</p>
          <div class="no_find">
            <a href="javascript:;">
              <i class="iconfont">&#xe63d;</i>
              <a><span><img src="~assets/images/samall_horn.png"/>找不到想要的？可以点我反馈哟</span></a>
            </a>
          </div>
        </div>
        <div>
          <div v-show="nomore">
            <div class="nomoregoods">
              <div class="niuniu">
                <img src="~assets/images/niuniu.png">
              </div>
              <p>亲，没有更多了</p>
            </div>
            <div class="no_find mt">
              <a href="javascript:;">
                <i class="iconfont">&#xe63d;</i>
                <a :href="url">
                                    <span>
                                    <img src="~assets/images/samall_horn.png"/>找不到想要的？可以点我反馈哟
                                    </span>
                </a>
              </a>
            </div>
          </div>
        </div>
      </div>
      <!-- 加载列表页 E-->
      <fn-loading></fn-loading>
    </div>
  </div>

</template>


<!-- <script type="text/ecmascript-6"> -->
<script>
  //默认值
  import {DEFAULT_CONFIG, BASEREQUSTBODY} from '../config/app.config';
  import {mapGetters, mapActions, mapMutations, mapState} from 'vuex'

  /**
   * 页面组件
   */
  import {
    fnHeadBox,
    fnSearch,
    fnListFilter,
    fnListTop,
    fnListPage,
    fnPagination
  } from 'components/list/index'


  /**
   * 公共组件
   */
  import fnLoading from "components/common/fn-loading"
  import fnTopNav from "components/common/fn-top-nav"
  import fnBigData from "components/common/fn-big-data"
  import fnAppdown from "components/common/fn-appdown"
  import {getScrollHeight, getWindowHeight, getScrollTop} from "../util/scroll"
  import _ from "lodash"

  let requestObj = {
    "sortType": 1,
    "sortOrder": 1,
    "sortPrice": null,
    "onePageSize": 10,
    "pageIndex": 1,
    "filters": [],
    "cate": "",
    "areaCode": $.cookie.getH5("siteid"),
    "search_price": {},
    "onlycamp": 0,
    "terms": {},
    "category_si_seq": "",
    "keywords": "",
    "si_seq": ""
  }

  export default {
    data(){

      return {
        defaultConfig: DEFAULT_CONFIG,//默认值
        showSuggestNav: false,  //显示搜索信息开关

        baseRequestBody: {}

      }

    },
    mounted() {
      let is_proprietary = this.$route.query.is_proprietary,
        is_mall = this.$route.query.is_mall,
        is_global = this.$route.query.is_global,
        is_stock = this.$route.query.is_stock;

      this.baseRequestBody = requestObj;

      this.baseRequestBody.cate = this.getCategory.cateid;
      this.baseRequestBody.keywords = this.getkeyword;
      this.baseRequestBody.si_seq = this.getCategory.cateid;

      this.baseRequestBody.terms = {
        "is_proprietary": is_proprietary,
        "is_mall": is_mall,
        "is_global": is_global,
        "is_stock": is_stock
      };

      this.onePageSize = this.baseRequestBody

      $.getToken(()=> {

        if (!this.getCategory.isCategory) {
          this.fetchSearchDataAction({body: this.baseRequestBody});

        } else {

          this.fetchSmByCategoryAtion({body: this.baseRequestBody});

        }

      })
      this.setKeysChange(this.getkeyword.replace('+', ' '));
      window.addEventListener('scroll', _.throttle(this.infiniteScroll, 200))

    },
    computed: {
      ...mapState({

        topLoading: state => state.list.topLoading,

        loadingAll: state => state.list.loadingAll,

        bottomLoading: state => state.list.bottomLoading,

        bodyFilters: state => state.list.bodyFilters,

        merchandiseList: state => state.list.merchandiseList,

        freshBody:state => state.list.freshBody,

        category: state => state.list.category,

        noShop: state => state.list.noShop,

        totalPage: state => state.list.totalPageSize,

        nomore: state => state.list.noMoreCount

      }),
      //生鲜类目进来的分类是否显示 *注意事项bodyData
      freshShowCate(){
        if(this.freshBody){
          return this.freshBody.isFresh === 1 && this.bodyData.level == 2 ? true : false;
        }

      },
      // 处理 打开app 的 密令
      dealAppUrl(){
        let url = "";
        if (this.getCategory.isCategory) {
          url = "GetSMbyCategory?si_seq=" + this.getCategory.cateid
        } else {
          url = "GetSMbyKey?keywords=" + this.$route.query.kw
        }
        return url;
      },
      getkeyword(){
        return this.$route.query.kw ? this.$route.query.kw.replace('+', ' ') : "";
      },
      desByPrice(){

        return this.baseRequestBody.sortPrice;

      },

      //获得是否是 馆页, cateid
      getCategory(){

        if (this.$route.name === "searchPage") {

          return {cateid: "", isCategory: false, keyword: this.$route.query.kw.replace('+', ' ')};

        }

        return {cateid: this.$route.params.cate, isCategory: true};

      },
      onePageSize(){
        return this.baseRequestBody.onePageSize
      },
      url(){
        return $.config.mDomain + '/searchList/feedback.html?si_seq=' + this.$route.query.kw;
      }
    },
    methods: {
      ...mapActions([
        'fetchSearchDataAction',
        'fetchSmByCategoryAtion'
      ]),
      ...mapMutations({
        setBottomLoading: 'SET_BOTTOM_LOADING',
        setKeysChange:'SET_KEYS_CHANGE'
      }),
      toggleTab(){
        this.showNav = !this.showNav
      },
      typeChange(option){
        //条件改变,刷新列表,查询第一页的数据
        option.pageIndex = 1;
        // no_shop = false;
        // nomore = false;
        // all_noshop = true;
        let params = Object.assign(this.baseRequestBody, option)
        this.topLoading = false;
        if (!this.getCategory.isCategory) {
          let obj = {
            body: params,
            isRefresh: true,
            isSearch: false,
            isRequestCate: true,
            cateBanner: true
          }
          this.fetchSearchDataAction(obj);
        } else {
          this.fetchSmByCategoryAtion({body: params})
        }

      },
      infiniteScroll(){
        let isLoadPage = getScrollTop() + getWindowHeight() >= getScrollHeight()
        if (isLoadPage) {
          if (this.baseRequestBody.pageIndex < this.totalPage) {

            this.setBottomLoading({type: true})

            this.baseRequestBody.pageIndex++
            this.baseRequestBody.keywords = this.baseRequestBody.keywords || this.getkeyword
            this.fetchSearchDataAction({body: this.baseRequestBody, isRefresh: false})
          } else if (!this.noShop) {

          }
        }

      },
      //隐藏分页提示
      pageHide(){

      },
      searchEvent(msg, cate){
        let self = this
        this.baseRequestBody = {
          "sortType": 1,
          "sortOrder": 1,
          "onePageSize": 10,
          "pageIndex": 1,
          "filters": [],
          "cate": cate || "",
          "areaCode": $.cookie.getH5("siteid"),
          "search_price": {},
          "onlycamp": 0,
          "terms": {},
          "fdlSeq": this.$route.query.fdlSeq,
          "category_si_seq": "",
          "keywords": ""
        }
        this.baseRequestBody.keywords = msg

        if (!cate) {
          if (this.$route.query.fdlSeq !== undefined) { //凑单页
            this.$router.push({
              name: 'searchPage',
              query: {fdlSeq: this.$route.query.fdlSeq},
              replace: true
            });

          } else { //搜索页
            this.$router.push({
              name: 'searchPage',
              query: {kw: msg},
              replace: true
            });
          }
        }

        //TODOS //如果下拉菜单展示，触发关闭
        //this.defaultConfig.isSearchEnter = true;
        this.fetchSearchDataAction({
          body: this.baseRequestBody,
          isRefresh: true,
          isSearch: true
        })
      },
      childSearch(){
        //输入框搜索
        this.defaultConfig.show = true;
        this.defaultConfig.show1 = true;
//        this.$broadcast('close-filterAddress');
      },
      //点击地址选择区块埋点
      quickDelivery(){
        this.defaultConfig.show1 = false;
        this.defaultConfig.show = true;
//        this.$broadcast('select-address');
        $('body').addClass('hideOverflow');
        $('html').addClass('hideOverflow');
        let data = {
          track_tag_name: '4122',
          track_type: '2'
        };
        $.stat.shangbao(data);
      }
    },
    components: {
      fnHeadBox,
      fnSearch,
      fnListTop,
      fnListPage,
      fnLoading,
      fnListFilter,
      fnTopNav,
      fnBigData,
      fnAppdown
    }
  }
</script>


<style>
  body, html {
    width: 100%;
    height: 100%;
    min-height: 100%;
    background: #eee;
  }

  .head_f {
    z-index: 555;
    width: 100%;
    max-width: 800px;
    min-width: 320px;
    position: absolute;
    top: 0;
    height: auto;

  }

  .nomoregoods {
    height: 2rem;
    background: #eee;
    padding: 0;
  }

  .nomoregoods .niuniu {
    width: 1.05rem;
    height: 1.1rem;
    margin: .3rem auto .1rem;
    position: relative;
  }

  .nomoregoods .niuniu:before {
    content: "";
    width: 1rem;
    height: 1px;
    background: #999;
    position: absolute;
    left: -1rem;
    top: 60%;
  }

  .nomoregoods .niuniu:before {
    content: "";
    width: 1rem;
    height: 1px;
    background: #999;
    position: absolute;
    left: -1rem;
    top: 60%;
  }

  .nomoregoods .niuniu:after {
    content: "";
    width: 1rem;
    height: 1px;
    background: #999;
    position: absolute;
    right: -1rem;
    top: 60%;
  }

  .nomoregoods .niuniu:after {
    content: "";
    width: 1rem;
    height: 1px;
    background: #999;
    position: absolute;
    right: -1rem;
    top: 60%;
  }

  .nomoregoods .niuniu img {
    width: 100%;
    height: 100%;
  }

  .nomoregoods p {
    text-align: center;
    font-size: .24rem;
    color: #666;
  }

  .mt {
    margin-top: 50px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s linear;
  }

  .fade-transition {
    -webkit-transition: opacity .3s linear !important;
    transition: opacity .3s linear !important;
  }

  .fade-enter, .fade-leave-active {
    opacity: 0
  }

  .no_product2 {
    font-size: 0;
    text-align: center;
    padding: .5rem 0;
  }

  .no_product2 div, .no_product2 img {
    display: inline-block;
    vertical-align: middle;

  }

  .no_product2 div {
    margin-left: .2rem;
  }

  .no_product2 img {
    width: 1rem;
    height: 1rem;
  }

  .no_product2 div p:last-child {
    margin-top: .2rem;
    font-size: .28rem;
  }

  .no_product2 div p span {
    color: #d6005b;
  }

</style>
<style scoped>
  @import '../assets/css/list.css';
</style>
