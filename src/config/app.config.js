/**
 * Created by yafei.wu on 2016/11/25.
 */
//data默认初始值
export const DEFAULT_CONFIG = {
  show: false,
  show1:false,
  topLoading: false,//头部加载刷新隐藏
  loadingAll: false,
  listBtn: false,
  listLoading: false,///下拉加载刷新隐藏
  all_noshop: true,//控制头部菜单展示与否
  no_shop: false,
  showList: true,//列表页展示
  bottom: true,
  pageIn: 1,
  scanPageNow: 1,//用户浏览的当前页数
  totalPageCount: 0,//接口返回的数据总页数
  word: '',
  ads: '',//区名
  showNav: false,
  isSearchEnter:false, //u用来判断是否是回车开关
  nomore: false,//没有更多了
  maskShow:false //凑单页显示蒙层展示与隐藏

};
//列表页默认接口参数值
export let BASEREQUSTBODY = {
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
  "si_seq": "",
  "fdlSeq":""
}
