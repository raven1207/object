import * as requestService from '../util/request';

let body = {
  "body": {},
  "token": $.cookie.getH5("token"),
  "apiVersion": $.config.apiVersion,
  "areaCode": $.cookie.getH5("siteid"),
  "device_id": $.cookie.getH5("device_id"),
  "addrId": "",
  "re_rule": "2" //默认是为2
}

//mock列表页数据
export function getMock(callback) {
  let body = {
    "token": $.cookie.getH5("token"),
    "apiVersion": $.config.apiVersion,
    "areaCode": $.cookie.getH5("siteid"),
    "device_id": $.cookie.getH5("device_id"),
    "addrId": "",
    "re_rule": "2"
  }
  return requestService.get(`http://so.local.beta1.fn:8080/static/data/banner.json`);
}

/**
 * 查询列表 根据条件
 * @param data
 * @returns {Promise}
 */
export function getSMbyKey(data,needFilter=true) {
  let body = {
    "needFilter": needFilter,
    "token": $.cookie.getH5("token"),
    "body": {},
    "addrId": ""
  }
  Object.assign(body, data);
  return requestService.ajaxGet(`${$.config.list}/getSmByKey`, body);
}

/**
 * 分类 查询列表 根据条件
 * @param data
 * @returns {Promise}
 */
export function getSmByCategory(data,needFilter=true) {
  let body = {
    "needFilter": needFilter,
    "token": $.cookie.getH5("token"),
    "body": {},
    "addrId": ""
  }
  Object.assign(body, data);
  return requestService.ajaxGet(`${$.config.list}/getSmByCategory`, body);
}
//获取详细信息
export function getDetailsApi(itemidArr,byPrice,siSeq) {
  let body = {
    areaCode:$.cookie.getH5("siteid"),
    desByPrice:byPrice,
    siSeq:siSeq,
    itemId:itemidArr
  }
  return requestService.ajaxGet(`${$.config.list}/itemDetail`, body);  //mock数据
}
//获取多倍积分接口用jsonp调用　m/getSaleMultipleScore/v1
export function getSaleMultipleScore(itemidArr) {
  let body = {
    areaCode:$.cookie.getH5("siteid"),
    itemId:itemidArr
  }
  return requestService.ajaxGet(`${$.config.acPath}/m/getSaleMultipleScore/v1`, body);
}
/*
 * 列表页搜索关键词推荐商品/merchandise/GetSearchSuggestion/
 * @param data
 * @returns {Promise}
 * */
export function getSearchSuggestion(data) {
  let body = {
    "body":{},
    "token": $.cookie.getH5("token"),
    "apiVersion":$.config.apiVersion,
    "areaCode": $.cookie.getH5("siteid"),
    "device_id": $.cookie.getH5("device_id"),
    "addrId": "",
    "re_rule": "2" //默认是为2
  }
  Object.assign(body, data);
  return requestService.ajaxGet(`${$.config.list}/getSearchSuggestion`, body);
}
/*
 * 列表页搜索关键词飞牛密令跳转merchandise/getLink
 * @param data
 * @returns {Promise}
 * */
export function getLink(data) {
  let body = {
    "body":{},
    "token": $.cookie.getH5("token"),
    "apiVersion":$.config.apiVersion,
    "areaCode": $.cookie.getH5("siteid"),
    "device_id": $.cookie.getH5("device_id"),
    "addrId": "",
    "re_rule": "2" //默认是为2
  }
  Object.assign(body, data);
  return requestService.ajaxGet(`${$.config.list}/getLink`, body);
}
/*
 * 列表页分类树http://list.m.beta1.fn/cateTree
 * @param data
 * @returns {Promise}
 * */
// export function getCateTree(cateTreeParams) {
//   return requestService.ajaxDefine (`${$.config.list}/cateTreeTest`, cateTreeParams);
// }

export function getCateTree(cateTreeParams) {
  return requestService.ajaxGet(`${$.config.list}/cateTree`, cateTreeParams);
}
