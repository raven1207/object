/**
 * Created by xialei on 16/10/11
 * updated by zhongqiang.feng  16/12/22
 */
/* 全局公共第三方埋点上报 */
function globalStatic(){
    let thirdStaticCtrl = $.config.thirdStaticCtrl,
        environment = $.config.environment;

    /* 以下这俩埋点不能通过isOn和环境是否为online来控制, 因为代码其他地方由于写的兼容不好会使用到_utaq.push()类似语法 */
    /* ut埋点 */
    thirdStaticCtrl.ut && uniclick();
    /* 不知道是啥埋点 */
    thirdStaticCtrl.w3t && w3t();
    /* 聚合埋点 */
    thirdStaticCtrl.mediaV && update_mvqCall();

    if(thirdStaticCtrl.isOn && environment.toLowerCase() == 'online'){
        window.setTimeout(function () {
            /* ga埋点 */
            thirdStaticCtrl.ga && googleAnalytics();
            /* 百度埋点 */
            thirdStaticCtrl.baidu && baiduStatic();
        }, 2000);
    }
}

/**
 * EVENT 第三方埋点触发动作
 * @param param
 */
function singlePageStatic(param) {

    let eventConfig = {
        /* 购物车页pageview */
        "pv_cart": function(_p) {
            update_mvqCall(function () {
                _mvq.push(['$setGeneral', 'cartview', getUserName('th5_username'), '', '']);
                _mvq.push(['$logConversion']);
                _mvq.push(['$addItem', '', _p.smseqs || '', '', '']);
                _mvq.push(['$logData']);
            });
        }
    };

    param.type && eventConfig[param.type] && eventConfig[param.type](param);
}


/**
 * unkonwn
 */
function w3t(){
    let _fxcmd=_fxcmd||[];
    _fxcmd.sid='45bb440b881fff70f4d7f948b5eaad2a';
    _fxcmd.trackAll=false;
    (function () {
        let _pzfx=document['createElement']('script');
        _pzfx.type='text/javascript';
        _pzfx.async=true;
        _pzfx.src='//static.w3t.cn/fx/1/1/fx.js';
        let sc=document.getElementsByTagName('script')[0];
        sc.parentNode.insertBefore(_pzfx,sc);
    })();
}

/**
 * 百度埋点
 */
function baiduStatic(){
    (function () {
        let hm = document.createElement("script");
        hm.src = "//hm.baidu.com/hm.js?0cc0039daba323e398ba8e7b837dd702";
        hm.async = true;
        let s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();
}

/**
 * UT埋点
 */
function uniclick(){
    let _utaq = _utaq || [];
    _utaq.push(["trackPageView"]);
    _utaq.push(["enableLinkTracking"]);
    (function() {
        let utu="https://sit.gentags.net/";
        _utaq.push(["setTrackerUrl", utu+"site/unids.gif"]);
        _utaq.push(["setSiteId", "927"]);
        let utd=document, ut=utd.createElement("script"), s=utd.getElementsByTagName("script")[0]; ut.type="text/javascript";
        ut.defer=true; ut.async=true; ut.src=utu+"adagent/js/uta.js"; s.parentNode.insertBefore(ut,s);
    })();
}

/**
 * google analytics
 */
function googleAnalytics(){
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
        a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
    ga('create', 'UA-46390714-1', 'auto');
    ga('send', 'pageview');
}


function getUserName(name) {
    let g = new RegExp("(^|;|\\s+)" + name + "=([^;]*)(;|$)", 'g');
    let a = document.cookie.match(g);
    let r = new RegExp("(^|;|\\s+)" + name + "=([^;]*)(;|$)");
    let m;
    if (a && a.length > 1) {
        m = a[a.length - 1];
        m = m.match(r);
    } else {
        m = document.cookie.match(r);
    }
    let val = (!m ? "" : decodeURIComponent(m[2]));
    if (!val) {
        val = '';
    }
    return val;
}

// 收集网站的访客cookie，计算访问量、浏览量，回传其他代码数据。
function update_mvqCall(callback) {

    let _mvq = window._mvq || [];
    window._mvq = _mvq;
    _mvq.push(['$setAccount', 'm-255566-0']);

    if(callback){
        callback();
        return ;
    }else{
        _mvq.push(['$setGeneral', '', getUserName('th5_username'), /*用户名*/ '', /*用户id*/ '']);
        _mvq.push(['$logConversion']);
        (function () {
            let mvl = document.createElement('script');
            mvl.type = 'text/javascript';
            mvl.async = true;
            mvl.src = ('https:' == document.location.protocol ? 'https://static-ssl.mediav.com/mvl.js' : 'http://static.mediav.com/mvl.js');
            let s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(mvl, s);
        })();
    }
}

export default {
    globalStatic: globalStatic,
    singlePageStatic: singlePageStatic
}
