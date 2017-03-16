/**
 * Created by zhongqiang.feng on 2016/10/20.
 */

let mDomain, cookieDomain, apiPath, acPath, memberApiPath, cartApiPath, wwwApiPath, bigData;

var mhead = window.location.protocol;

if (environment === 'beta' || environment === 'local') {
  //多地多仓beta2
  mDomain = mhead + '//m.beta1.fn';
  cookieDomain = '.beta1.fn';
  acPath = mhead + "//ac.beta1.fn";
  //接口负责人-沈瀛杰
  apiPath = mhead + '//list.m.beta1.fn';
  memberApiPath = mhead + "//member-fnapp.feiniugo.com";
  //接口负责人-杨雯斌  黄赛华
  bigData = mhead + "//recommend-web01.beta.fn:8080";
  //接口负责人-刘洪建 邓家杰
  cartApiPath = mhead + "//cart-fnapp.feiniugo.com";
  //接口负责人-刘洪建
  wwwApiPath =  mhead + "//www-fnapp.feiniugo.com";

} else if (environment === 'preview') {
  mDomain = mhead + '//preview.m.feiniu.com';
  cookieDomain = '.feiniu.com';
  apiPath = mhead + '//list.m.feiniu.com';
  acPath = mhead + "//ac.feiniu.com";
  memberApiPath = mhead + "//preview-member-fnapp.feiniu.com";
  // member2ApiPath= mhead+"//preview-member-fnapp.feiniugo.com";
  bigData = mhead + "//preview.reco.feiniu.com";
  cartApiPath = mhead + "//preview-cart-fnapp.feiniu.com";
  wwwApiPath = mhead + "//preview-www-fnapp.feiniu.com";

} else if (environment === 'online') {

  mDomain = mhead + '//m.feiniu.com';
  cookieDomain = '.feiniu.com';
  apiPath = mhead + '//list.m.feiniu.com';
  acPath = mhead + "//ac.feiniu.com";
  memberApiPath = mhead + "//member-fnapp.feiniu.com";
  // member2ApiPath= mhead+"//member-fnapp.feiniugo.com";
  bigData = mhead + "//reco.feiniu.com";
  cartApiPath = mhead + "//cart-fnapp.feiniu.com";
  wwwApiPath = mhead + "//www-fnapp.feiniu.com";
}

/**
 * 默认的初始化配置
 */
export const config = {
  osType: "3", //系统触屏
  apiVersion: "t5.10",
  version: "t510",
  md5str: "%$#(*&*aeere1234234",
  member: memberApiPath,
  cart: cartApiPath,
  www: wwwApiPath,
  bigData: bigData,
  mDomain: mDomain,
  cookieDomain: cookieDomain,
  environment: environment,
  list: apiPath,
  acPath:acPath,
  kefutel: '400-920-6565', // 客服电话
  cod: 6, // 货到付款ID
  apkUrl: 'http://apk.feiniugo.com/FeiNiuWangH5ShouYe.apk',
  iphoneAppUrl: 'http://itunes.apple.com/cn/app/id921839681?ls=1&mt=8',
  qqAppUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.feiniu.market',
  iosUrl: 'https://itunes.apple.com/cn/app/fei-niu-wang-da-run-fa-wang/id921839681?l=zh&ls=1&mt=8&tp=www.0.1000-fnphone.3.1469515969945Rl2g',
  payCode: [6, 11],
  thirdStaticCtrl: {
    baidu: true,
    ga: true,
    isOn: true,
    mediaV: true,
    ut: true,
    w3t: true
  }
}
