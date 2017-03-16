import url from "./url";
import cookie from "./cookie";
import {config} from "../config/config";
import * as token from "./token";
import getDeviceId from "./device";
import stat from "./stat";
import _init from "./checkCompatibility";
import thirdStatic from "./thirdStatic";
// import popCity from  "./popCity";
import {getProvinces} from  "../services/addressService";
//系统公用配置
$.config = config;

//cookie 公用类
$.cookie = cookie;

// 获取浏览器兼容信息
$.cmpt = _init();

// URL 公用类
$.url = url;

//埋点
$.stat = stat;

//第三方埋点
$.thirdStatic = thirdStatic;



// 如果不支持localStorage则用cookie替代
if ($.cmpt.isLocalStorageSupported) {
  $.localStorage = window.localStorage;
} else {
  $.localStorage = {};
  $.localStorage.setItem = $.cookie.add;
  $.localStorage.getItem = $.cookie.get;
  $.localStorage.removeItem = $.cookie.del;
}
if ($.cmpt.detectUa.browser == 6) {
  // QQ浏览器不支持sessionStorage
  $.cmpt.isSessionStorageSupported = false;
}
// 给html加上全局class以区分设备
$('html').addClass('device-' + $.cmpt.detectUa.osname);

/**
 * 检测基本数据类型和内置对象
 * @param o
 */
$.typeOf = function (o) {
  let _toString = Object.prototype.toString;

  let _type = {
    "undefined": "undefined",
    "number": "number",
    "boolean": "boolean",
    "string": "string",
    "[object Function]": "function",
    "[object RegExp]": "regexp",
    "[object Date]": "date",
    "[object Error]": "error"
  };
  return _type[typeof o] || _type[_toString.call(o)] || (o ? "object" : "null");
}
/**
 * 判断是否为空
 */
$.isNull = function(o) {
  return o == undefined || o == "undefined" || (o + '').indexOf("undefined") > -1 || o == null || o == '';
};

/**
 * 判断是否是空对象
 * @param e 对象
 * @returns {boolean}
 */
$.isEmptyObject = function (e) {
  let t;
  for (t in e)
    return !1;
  return !0
};

/**
 * jsonparse
 */
$.parseJSON = function (str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return (new Function('try{return ' + str + '}catch(e){return undefined}'))();
  }
};


$.checkLoginCookie = function() {
  // App下不检测登录环境
  if (config.osType == 1 || config.osType == 2 || config.osType == 9) {
    return 1;
  }
  let loginEnv = $.cookie.getH5('loginEnv');
  if ($.isNull(loginEnv)) {
    return 1;
  }
  if (loginEnv == 'preview' || loginEnv == 'online' || loginEnv == 'm' || config.environment == 'preview' || config.environment == 'online' || config.environment == 'm') {
    if (loginEnv == config.environment) {
      return 1;
    } else {
      let msg = '登录环境发生变化：已登录环境' + loginEnv + '，当前环境' + config.environment;
      console.warn(msg);
      window._checkLoginCookie_msg = msg;
      $.logOut();
      return 0;
    }
  } else {
    return 1;
  }
};
$.isWeixin = function() {
  //判断是否在微信内
  let ua = navigator.userAgent.toLowerCase();
  let isWeixin = ua.indexOf('micromessenger') != -1;
  return isWeixin;
}

$.logOut = function() {
  $.cookie.delH5("loginEnv", "/", config.cookieDomain);
  $.cookie.delH5("cartNum", "/", config.cookieDomain);
  $.cookie.delH5("islogin", "/", config.cookieDomain);
  $.cookie.delH5("islogin", "/", 'm.feiniu.com'); //用于容错，勿删
  $.cookie.delH5("username", "/", config.cookieDomain);
  $.cookie.delH5("username", "/", 'm.feiniu.com'); //用于容错，勿删
  $.cookie.delH5("mem_guid", "/", config.cookieDomain);
  $.cookie.delH5("mem_guid", "/", 'm.feiniu.com'); //用于容错，勿删
  $.cookie.delH5("accountType", "/", config.cookieDomain);
  $.cookie.delH5("accountType", "/", 'm.feiniu.com'); //用于容错，勿删
}
/**
 * 格式化日期
 * @param date
 * @param format
 * @returns {*}
 */
$.formatDate = function(date, format){
  let o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3) //季度
  };
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return format;
}



//更新vvip状态
$.updateVvipStatus = function() {
  // modelVvip.updateVvipStatus({}, function() {
  //   //接口不做返回，不管成功失败，都种上th5_update_vvipstatus
  // })
  let expire = new Date();
  expire.setHours(24, 0, 0, 0); //设置过期时间为当天晚上24点
  let expireUTC = expire.toUTCString(); //cookie设置的时间为世界协调时间 (UTC)，北京时间比其快8小时
  $.cookie.addH5("update_vvipstatus", 1, "/", expireUTC, config.cookieDomain, 1);
}

$.localStorage = {
  getItem : function(key){
    if (typeof localStorage === 'object') {
      try {
        return JSON.parse(localStorage.getItem(key));
      } catch (e) {
        alert('本站无痕浏览模式,请关闭后再试!');
      }
    }
  },
  setItem : function(key,value){
    if (typeof localStorage === 'object') {
      try {
        return localStorage.setItem(key,JSON.stringify(value));
      } catch (e) {
        alert('请关闭[无痕浏览]模式后再试!');
      }
    }
  },
  removeItem : function(key){
    if (typeof localStorage === 'object') {
      try {
        return localStorage.removeItem(key);
      } catch (e) {
        alert('请关闭[无痕浏览]模式后再试!');
      }
    }
  },
  getUseSize : function(){
    if (typeof localStorage === 'object') {
      try {
        return JSON.stringify(localStorage).length;
      } catch (e) {
        alert('请关闭[无痕浏览]模式后再试!');
      }
    }
  }
};

$.merge = function() {
  if (arguments.length > 0) {
    let re = arguments[0];
    for (let i = 1; i < arguments.length; i++) {
      let o = arguments[i];
      for (let p in o) {
        if (o[p] != undefined) {
          re[p] = o[p];
        }
      }
    }
    return re;
  }
  return undefined;
};

$.getToken = function(successCallback, failCallback, isForce) {

  //性能上报
  // shangbaoPerformance.checkNonTxDomain();
  // js加载完毕时间戳及耗时
  try {
    var curTime = (new Date()).getTime();
    shangbaoPerformance.jsLoadTime(curTime - jsLoadStartTime);
  } catch (e) {
    // $.log(e)
  }
  //todo 暂时去掉了  性能上报
  token.default.getToken(function(data) {
    if (data.errorCode == 0) {
      successCallback && successCallback();
    } else {
      if (typeof failCallback == 'function') {
        failCallback && failCallback(data);
      } else {
        $.toast('token获取失败,请检查您的网络！');
      }

    }
  }, isForce);
}

//设置device_id
window.device_id = $.cookie.getH5('device_id') || '';
if (!window.device_id) {
  window.device_id = getDeviceId();
  $.cookie.addH5('device_id', window.device_id, '/', 365 * 24 * 3600, config.cookieDomain);
}

/**
 * 设置 siteid  如果没有  默认上海
 * @type {*|string}
 */
// window.siteid = $.cookie.getH5('siteid') || '';
// if (!window.siteid) {
//   $.cookie.addH5('siteid', "CS000016-0-0-0", '/', 365 * 24 * 3600, config.cookieDomain);
// }


//isThirdApp 当前页面被嵌入在第三方APP中，禁用自动跳转飞牛APP的功能
let isThirdApp = $.url.xss($.url.getParam('isThirdApp'));
if (isThirdApp) {
  $.cookie.addH5('isThirdApp', isThirdApp, '/', 86400 * 365, configUrl.cookieDomain);
}

let isOldchannel_edm_code = true;
let channel_edm_code = $.url.xss($.url.getParam('ref'));
let channel_edm_codeCookieVal = $.cookie.getH5("channel_edm_code");
if (channel_edm_code) {
  $.cookie.addH5("channel_edm_code", channel_edm_code, "/", 86400 * 1, '.feiniu.com');
} else if (!$.isNull(channel_edm_codeCookieVal) && !(/^ref_/i.test(channel_edm_codeCookieVal))) {
  isOldchannel_edm_code = false;
  $.cookie.addH5("channel_edm_code", channel_edm_codeCookieVal, "/", 86400 * 1, '.feiniu.com');
} else {
  //处理ref
  let ref = document.referrer;
  let _curDomain = 'feiniu.com';
  let refVal = '',
    refStr = '';
  if (ref) {
    let indexWen = ref.indexOf('?');
    if (indexWen != '-1') {
      refStr = ref.substring(0, indexWen);
    } else {
      refStr = ref;
    }
    if (refStr.indexOf(_curDomain) == -1) {
      let firstIndex = ref.indexOf(':');
      let firstStr = ref.substring(firstIndex + 3);
      let httpVal = ref.substring(0, firstIndex + 3);
      let lastIndex = firstStr.indexOf('/');
      let returnVal = firstStr.substring(0, lastIndex);
      let refHost = httpVal + returnVal;
      refVal = 'ref_' + refHost;
      $.cookie.addH5('channel_edm_code', refVal, "/", 86400 * 1, '.feiniu.com');
      isOldchannel_edm_code = false;
    }
  }

  if (isOldchannel_edm_code && channel_edm_codeCookieVal) {
    $.cookie.addH5("channel_edm_code", channel_edm_codeCookieVal, "/", 86400 * 1, '.feiniu.com');
  }

}
let channel_adr_id = $.url.xss($.url.getParam('adr_id'));
if (channel_adr_id) {
  $.cookie.addH5("channel_adr_id", channel_adr_id, "/", 86400 * 1, '.feiniu.com');
} else if (!$.isNull($.cookie.getH5("channel_adr_id"))) {
  $.cookie.addH5("channel_adr_id", $.cookie.getH5("channel_adr_id"), "/", 86400 * 1, '.feiniu.com');
}


// 1android，2ios，3h5触屏  9微信
let getAppid = function() {
  let _ua = navigator.userAgent;
  _ua = _ua.toLowerCase();
  if (navigator.userAgent.indexOf('feiniuapp') > -1 || navigator.userAgent.indexOf('feiniumapp') > -1) {
    let userAgent = navigator.userAgent.split(' ');
    for (let i = 0; i < userAgent.length; i++) {
      if (userAgent[i].indexOf('feiniuapp') > -1 || userAgent[i].indexOf('feiniumapp') > -1) {
        let yixunAgent = userAgent[i].split('/');
        let agent = yixunAgent[1].toLowerCase();
        if (agent == 'android') {
          return 1;
        } else if (agent == 'iphone') {
          return 2;
        } else if (agent == 'ipad') {
          return 4;
        } else if (agent == 'winphone') {
          return 5;
        }
      }
    }
  } else if ($.url.getParam('osType') && $.url.getParam('osType') != '') {
    if (_ua.match(/MicroMessenger/i) == 'micromessenger') {
      //微信
      return 9;
    }
    return $.url.getParam('osType');
  } else if (_ua.match(/MicroMessenger/i) == 'micromessenger') {
    //微信
    return 9;
  }
  return 3;
};

let appId = getAppid();
if (appId != 1 && appId != 2) {
  //更新vvip状态
  //检查cookie（th5_update_vvipstatus），当不存在cookie时，调用api接口misc/updateVvipStatus，接口不会有返回值
  let update_vvipstatus = $.cookie.getH5("update_vvipstatus");
  //如果cookie不存在，则调用接口
  if (!update_vvipstatus) {
    $.getToken(
      $.updateVvipStatus
    );
  }
}
//地区选择弹出框，三级地区
function getCityList() {
  var cityData = {
    body: {
      comeFrom: 'index'
    }
  };
  $.getToken(()=>{
    // getProvinces(cityData).then((res)=> {
    //   if (res.errorCode == 0) {
    //     $.popCityInit = popCity.init(function() {
    //       return res;
    //     });
    //   } else {
    //     $.toast(res.errorDesc || "网络错误");
    //   }
    // });
  })

}
//排除APP情境下的idigger埋点
if (!(appId == 2 || appId == 1)) {
  if ($.isNull($.cookie.getH5("siteid"))) {
    getCityList();
  };
  // idigger.update_mvqCall();//外部第三方埋点
  $.thirdStatic.globalStatic();
  // popCity.init();
  // $.popCity = popCity;
}

