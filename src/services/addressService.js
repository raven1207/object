import * as requestService from '../util/request';
//w公共的参数
// let body={
//   "body":{},
//   "token":$.cookie.getH5("token"),
//   "apiVersion":$.config.apiVersion,
//   "areaCode": $.cookie.getH5("siteid"),
//   "device_id": $.cookie.getH5("device_id"),
//   "addrId": $.cookie.getH5("addrId"),
//   "re_rule": "2" //默认是为2
// }
//常用收货地址
export function getAddressList(data) {
  let body={
    "body":{},
    "token":$.cookie.getH5("token"),
    "apiVersion":$.config.apiVersion,
    "areaCode": $.cookie.getH5("siteid"),
    "device_id": $.cookie.getH5("device_id"),
    "addrId": $.cookie.getH5("addrId"),
    "re_rule": "2" //默认是为2
  }
  Object.assign(body, data);
  //接口负责人－宋庭勇或者闫立强  辛炜 杨申辉
  return requestService.post(`${$.config.member}/address/getAddressList/${$.config.version}`, body);
}
//选择其它地址
export function getNextAddress(data) {
  let body={
    "body":{},
    "token":$.cookie.getH5("token"),
    "apiVersion":$.config.apiVersion,
    "areaCode": $.cookie.getH5("siteid"),
    "device_id": $.cookie.getH5("device_id"),
    "addrId": $.cookie.getH5("addrId"),
    "re_rule": "2" //默认是为2
  }
  Object.assign(body, data);
  return requestService.post(`${$.config.member}/citylist/getNextAddress/${$.config.version}`, body);
}/**
 * Created by yafei.wu on 2016/11/10.
 */

function getBizObj4() {
  let bizObj = {
    token: $.cookie.getH5('token'),
    body: {
      areaCode: '',
      province: '',
      cityName: '',
      comeFrom: '',
      itno: ''
    }
  };
  return bizObj;
}
/**
 * 获取省级地址
 * @param  {Object}   dataInfo 传给接口的参数
 * @param  {Function} callback 处理返回数据的回调函数
 * @return
 */
export function getProvinces(data) {
  var bizDataObj = getBizObj4();
  var data = data || {};
  if (data.body) {
    Object.assign(bizDataObj.body,data.body);
  }
  return requestService.post(`${$.config.member}/citylist/getprovinces/${$.config.version}`, bizDataObj);
}


