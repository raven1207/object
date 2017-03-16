<template>
  <div class="pop_appdown J_popAppdown" :class="{fn_search_z:maskShow}" id="popAppdown" v-show="show">
    <div class="mbox">
      <p class="appdown_close2" @click="closeAppdown">
        <img src="~assets/images/appdown/closen2.png"/>
      </p>
      <p class="appdown_logo">
        <img src="~assets/images/appdown/app_logo.png"/>
      </p>
      <p class="appdown_dsc J_appDown">
        <span>下载飞牛APP</span>
        <span>首次登录送<em>5</em>元</span>
      </p>
      <p class="appdown_down" @click="appDown">立即下载</p>
    </div>
  </div>
</template>
<style>
  @import '~assets/css/fn_appdown.css';
</style>
<script type="text/ecmascript-6">
  import {mapState} from 'vuex'
  let closeAppDivDate = parseInt($.cookie.getH5('closeAppDivDate')),
    dateThree = parseInt((1000 * 60 * 60 * 24) * 3), //三天
    dateNow = new Date().getTime(), //获取当前时间
    closeAppDate = parseInt(dateNow) - parseInt(closeAppDivDate);

  var uaInfo = $.cmpt.detectUa;
  var ua = uaInfo.scene; //iphone浏览器:1, android浏览器: 2,  weixin:3, iPhone app内4，android app内5, 其他:9

  export default{
    props: {
      appUrl: String
    },
    data(){
      return {
        show: false
      }
    },
    computed:{
      ...mapState({
        maskShow: state => state.list.maskShow
      })
    },
    mounted(){
      /* 如果是翼支付环境下,隐藏头部下载条 */
      if (navigator.userAgent.indexOf('bestpay') > -1) {
        this.show = false;
        return;
      }
      if ($(window).scrollTop() > 0) {
        this.show = false;
      } else {
        /* 不是翼支付环境下走正常逻辑 */
        if (!closeAppDivDate) {
          /* 没有种过cookie */
          this.show = true;
        } else {
          if (closeAppDate > dateThree) {
            /* 超过三天 */
            this.show = true;
          } else {
            /* 三天之内 */
            this.show = false;
          }
        }
      }


      var closeAppDivDate = parseInt($.cookie.getH5('closeAppDivDate')), //用户点击关闭时时间
        dateThree = parseInt((1000 * 60 * 60 * 24) * 3); //三天

      /***
       * 如果用户已经唤醒过app 则增加3天 延迟 唤起
       */
      var appManoeuvreDate = parseInt($.cookie.getH5('appManoeuvreDate')),
        ThreeDay = parseInt((1000 * 60 * 60 * 24) * 3), //三天
        dateNow = new Date().getTime(); //获取当前时间

      if (appManoeuvreDate) {
        var ManoeuvreDate = parseInt($.cookie.getH5('appManoeuvreDate'));
        if (parseInt(dateNow) - parseInt(ManoeuvreDate) < ThreeDay) {
          return;
        }
      } else {
        $.cookie.addH5('appManoeuvreDate', dateNow, '/', 60 * 60 * 24 * 3);
      }
      if (ua == 1) {//iphone浏览器
        if ($.cmpt.detectUa.core == 1 && $.cmpt.detectUa.browsername == 'safari' && parseInt($.cmpt.detectUa.version) >= 9) {
          return;
        } else {
          if(this.$route.query.fdlSeq==undefined) this.appSkip();
        }
      } else {
        if(this.$route.query.fdlSeq==undefined) this.appSkip();
      }

    },
    methods: {
      appSkip(){
        console.log("调用唤起 APP");
        var self = this;
        try {
          let tmCheck;
          tmCheck = setTimeout(function () {
            var uaInfo = $.cmpt.detectUa;
            var ua = uaInfo.scene; //iphone浏览器:1, android浏览器: 2,  weixin:3, iPhone app内4，android app内5, 其他:9
            if (ua == 1) {
              $.url.redirect("FeiniuMart://" + self.appUrl);
            } else{
              $.url.redirect("feiniumart://" + self.appUrl);
            }

          }, 100);
        } catch (e) {
          alert("当前环境无法打开app")
          console.log("当前环境无法打开app");
        }
      },
      /**
       * 下载APP
       * @param obj
       * @private
       */
      appDown(){
        /* iphone浏览器:1, android浏览器: 2,  weixin:3, iPhone app内4，android app内5, 其他:9 */
        var ua = $.cmpt.detectUa.scene,
          browserStyle = window.navigator.userAgent.toLowerCase(),
          iosUrl = $.config.iosUrl,
          androidUrl = $.config.apkUrl;


        /* author: nick.xia 如果是IOS下点击顶部下载横幅,直接打开APPSTORE */
        if (ua == 1) {
          /* 跳转至Appstore */
          $.url.redirect(iosUrl);
        } else if (ua == 3 || browserStyle.indexOf('qqbrowser') !== -1) {
          /* 微信 or QQ浏览器 */
          $.url.redirect("http://a.app.qq.com/o/simple.jsp?pkgname=com.feiniu.market");
        } else {
          /* 下载android app */
          $.url.redirect(androidUrl || $.url.getTouchBaseUrl() + "download/index");
        }

      },
      closeAppdown(){
        this.show = false;
        $.cookie.addH5('closeAppDivDate', new Date().getTime(), '/', 60 * 60 * 24 * 3); //将关闭的当前时间存入cookie
      }

    }
  }
</script>

