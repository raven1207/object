function maidian() {
    this.ua = navigator.userAgent;
    this.udid = '';
    this.env = null;
    //屏幕分辨率
    this.resolution = window.screen.width + '|' + window.screen.height;

    this.cookieDomain = function () {
        var b = /m\.feiniu\.com/i.test(location.href);
        if (b) {
            return '.feiniu.com';
        } else {
            return location.hostname.split('.').slice(-2).join('.');
        }
    };

    this.getTime = function () {
        return (new Date()).getTime();
    };

    /**
     * by Nick
     * 判断是否是空对象
     * @param e 对象
     * @returns {boolean}
     */
     this.isEmptyObject = function(e) {
        var t;
        for (t in e)
            return !1;
        return !0
    };

    this.randomString = function (length) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
        if (!length) {
            length = Math.floor(Math.random() * chars.length);
        }
        var str = '';
        for (var i = 0; i < length; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    };

    /**
     * 生成唯一udid
     */
    this.createUdid = function () {
        if (this.udid) {
            return this.udid;
        }
        var udid = "";
        var t = this.getTime();
        udid += 'H5_' + t + this.randomString(10);
        this.udid = udid;
        return udid;
    };

    this.getcookie = function (name) {
        var r = new RegExp("(^|;|\\s+)" + name + "=([^;]*)(;|$)");
        var m = document.cookie.match(r);
        return (!m ? "" : decodeURIComponent(m[2]));
    };
    this.addcookie = function (name, v, path, expire, domain) {
        var s = name + "=" + encodeURIComponent(v) + "; path=" + (path || '/') // 默认根目录
            + (domain ? ("; domain=" + domain) : '');
        if (expire > 0) {
            var d = new Date();
            d.setTime(d.getTime() + expire * 1000);
            s += ";expires=" + d.toGMTString();
        }
        document.cookie = s;
    };
    this.delcookie = function (name, path, domain) {
        if (arguments.length == 2) {
            domain = path;
            path = "/"
        }
        document.cookie = name + "=;path=" + path + ";" + (domain ? ("domain=" + domain + ";") : '') + "expires=Thu, 01-Jan-70 00:00:01 GMT";
    };

    //获取设备ID
    this.getUdid = function () {
        var key = 'th5_stat_udid';
        var cookieudid = this.getcookie(key);
        if (cookieudid) return cookieudid;
        var udid = this.createUdid();
        var expire = 86400 * 365;
        var b = /feiniu\.com/i.test(location.href);
        var d = '.feiniu.com';
        if (!b) {
            d = location.hostname.split('.').slice(-2).join('.');
        }
        this.addcookie(key, udid, '/', expire, d);
        return udid;
    };

    this.getEnv = function () {
        if (this.env != null) {
            return this.env;
        }
        //环境 m表生产环境，beta表预发，test表测试环境，dev表开发，local表本地
        // var allEnv = ['m', 'preview', 'test', 'dev', 'dev1', 'local'];
        // var environment = 'm';
        // var domainSplitAry = location.hostname.split('.');
        // if (domainSplitAry[0]) {
        //     for (var i in allEnv) {
        //         if (allEnv[i] == domainSplitAry[0]) {
        //             environment = domainSplitAry[0];
        //             continue;
        //         }
        //     }
        // }
        // if (domainSplitAry[0] == 'm' && domainSplitAry[1] == 'beta1') {
        //     environment = 'test';
        // }
        // if (domainSplitAry[0] == 'local' && domainSplitAry[1] == 'beta1') {
        //     environment = 'local';
        // }

        var allEnv = ['dev', 'beta', 'preview', 'online'];
        for (var i = 0; i < allEnv.length; i++) {
            if (!!~window.location.host.indexOf(allEnv[i])) {
                environment = allEnv[i];
                break;
            } else {
                environment = allEnv[i];
            }
        }

        this.setEnv(environment);
        return environment;
    };
    this.setEnv = function (env) {
        this.env = env;
    };

    //获取操作系统
    this.getSystemType = function () {
        var _ua = this.ua;
        _ua = _ua.toLowerCase();
        // android:1,IOS:2, windowsPhone:3, 其他:9
        var sys = "";
        if (_ua.indexOf('android') > -1 || _ua.indexOf('linux') > -1) {
            sys = 'android';
        } else if (_ua.indexOf('iphone') > -1 || _ua.indexOf('ipad') > -1 || _ua.indexOf('itouch') > -1 || _ua.indexOf('ipod') > -1 || _ua.indexOf('mac') > -1) {
            sys = 'ios';
        } else if (_ua.indexOf("windows phone") > -1) {
            sys = 'wp';
        } else {
            sys = 'windows';
        }
        return sys;
    };

    this.mix = function () {
        var re = {};
        for (var i = 0; i < arguments.length; i++) {
            var o = arguments[i];
            for (var p in o) {
                if (p in re) {
                    if (o[p] != undefined) {
                        re[p] = o[p];
                    }
                } else {
                    re[p] = o[p];
                }
            }
        }
        return re;
    };

    //获取URL指定参数
    this.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    };

    this.getMessage = function () {
        var _m = this.getUrlParam('fromtype');
        if (_m == null) {
            _m = document.referrer ? document.referrer : '';
        }
        return _m;
    }

    /*
     获取remarks配置信息
     备注信息，只需当第一次进页面或session|token改变时传以下参数
     */
    this.getRemarksCfg = function () {
        var initCfg = {
            terminal_os_ver: "",//系统版本, 触屏传空 或不传
            model: "",//机型  触屏传空 或不传
            brand: "",//品牌  触屏传空 或不传
            resolution: this.resolution,//分辨率
            browser_type: "",//浏览器，触屏不传，服务器自动抓取ua信息
            mac: '' //机器mac地址触屏传空或不传
        }
        return JSON.stringify(this.mix(initCfg));
    };

    //判断是否需要上报客户端信息
    this.isClient = function () {
        var key = 'th5_stat_token';
        var expire = 86400;
        var token = this.getcookie('th5_token') || '';
        var statToken = this.getcookie('th5_stat_token') || '';

        //若两值相等或者statToken为-1则不需上报客户端信息
        if (token && statToken == token) return '';
        if (statToken == '-1') {
            if (token) {
                this.addcookie(key, token, '/', expire, this.cookieDomain());
            }
            return '';
        }

        //都有值且不相等需上报 且要重新种cookie
        if (statToken != token || !statToken) {
            var token = token || '-1';
            this.addcookie(key, token, '/', expire, this.cookieDomain());
        }
        return this.getRemarksCfg();
    }

    //打开页面时间
    var stime = this.getTime();
    var user_name = this.getcookie('th5_username') || '';
    var city_name = this.getcookie('th5_sitename') || '';
    var user_id = this.getcookie('th5_mem_guid') || '';
    if (!user_id && user_name) {
        user_id = user_name;
    }

    //获取着陆地址
    this.getLandingUrl = function () {
        var key = 'th5_landing_url';
        var landingUrl = this.getcookie(key) || '';
        var expire = 1800;
        if (landingUrl) {
            this.addcookie(key, landingUrl, '/', expire, this.cookieDomain());
            return landingUrl;
        }
        //半小时过期，重新生成着陆地址
        var curUrl = window.location.href;
        this.addcookie(key, curUrl, '/', expire, this.cookieDomain());
        return curUrl;
    }

    //判断着陆session是否过期
    this.getLandingSession = function () {
        var key = 'th5_landing_session';
        var landingSession = this.getcookie(key) || '';
        var expire = 1800;
        if (landingSession) {
            this.addcookie(key, landingSession, '/', expire, this.cookieDomain());
            return landingSession;
        }
        //半小时过期，重新生成session
        var ldid = "";
        ldid += 'H5_' + this.getTime() + this.randomString(10);
        this.addcookie(key, ldid, '/', expire, this.cookieDomain());
        return ldid;
    };

    this.setLandingSession = function (str) {
        var key = 'th5_landing_session';
        var expire = 1800;
        this.addcookie(key, str, '/', expire, this.cookieDomain());
    };

    // 1android，2ios，3触屏  9微信
    this.getAppid = function () {
        var _ua = navigator.userAgent;
        _ua = _ua.toLowerCase();
        if (navigator.userAgent.indexOf('feiniuapp') > -1) {
            var userAgent = navigator.userAgent.split(' ');
            for (var i = 0; i < userAgent.length; i++) {
                if (userAgent[i].indexOf('feiniuapp') > -1) {
                    var yixunAgent = userAgent[i].split('/');
                    var agent = yixunAgent[1].toLowerCase();
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
        } else if (this.getUrlParam('osType') && this.getUrlParam('osType') != '') {
            if (_ua.match(/MicroMessenger/i) == 'micromessenger') {
                //微信
                return 9;
            }
            return this.getUrlParam('osType');
        } else if (_ua.match(/MicroMessenger/i) == 'micromessenger') {
            //微信
            return 9;
        }
        return 3;
    };

    /* 把cookie中的th5_stat_app解析成对象 */
    this.statAppVal = function () {
        var sObj = {};
        var _stat_app = this.getcookie('th5_stat_app');
        if (_stat_app) {
            try {
                sObj = JSON.parse(_stat_app);
            } catch (e) {

            }
        }
        if (typeof sObj == 'undefined' || !sObj) {
            sObj = {};
        }
        return sObj;
    };

    this.urlConfigParam = {
        'udid': this.getUdid(),//登录设备ID
        'mem_guid': user_id,//用户ID
        'user_name': user_name,
        'terminal_os': this.getSystemType(),//操作系统
        //'ver': '1.0.0.0',//app版本
        'track_code': this.getcookie('th5_channel_edm_code') || '',
        //'traffic_channel': document.referrer ? document.referrer : '-',//来源渠道url  半小时内不动则cookie过期，
        //'ip': '',//IP地址
        'network': '',//联网方式
        'gps': '',//经纬度
        'city': city_name,//当前城市
        'track_tag_name': '',//具体行为
        'result': '',//请求结果
        'page_content': '',//页面内容
        'message': '',//页面详细内容
        'cur_req_url': location.href,//请求URL
        'landing_url': '',//着陆地址，有效期半小时
        'session_id': '',
        'track_type': 1,
        'referer_url': document.referrer || '',
        //'forward_url': '',//接口请求url，或者超链接地址
        //'datetime':'',
        'startTime': stime,//开始时间
        'endTime': stime,
        'abtest': '',
        //'token': this.getcookie('th5_token'),
        'remarks': '',
        'ver': '', // app版本
        'traffic_channel': '', //app下载渠道
        'dev_type': this.getAppid(),
        'ref_page_id': '',
        'client_type': 0,
        'delayTime': ''  //性能performance系列元数据
    }

    this.doShangBao = function(cfg, callback, timeout){
        var mhead = window.location.protocol, mdUrl = '';
        var environment = this.getEnv();
        if (environment == 'online') {
            //线上环境使用如下的性能上报地址，其他环境使用原来的上报地址
            mdUrl = mhead + "//flume.feiniu.com/AppCollectLogs/AddH5Log?v=" + this.getTime();
        } else if (environment == 'preview') {
            mdUrl = mhead + "//stage-flume.feiniu.com:8080/AppCollectLogs/AddH5Log?v=" + this.getTime();
        } else {//上报到test地址
            mdUrl = mhead + "//track01.beta1.fn:8089/AppCollectLogs/AddH5Log?v=" + this.getTime();
        }
        mdUrl += this.randomString(2);
        //参数赋值/替换 cfg = {JSON对象}
        var cfg = cfg || {};
        if (cfg.message == '-9') {
            cfg.message = this.getMessage();
        }

        if (typeof cfg.statApp == 'object') {
            cfg.udid            = cfg.statApp.udid || '';
            cfg.udid_first_time = cfg.statApp.udid_first_time || '';
            cfg.client_type     = cfg.statApp.client_type || '';
            cfg.delayTime     = cfg.statApp.delayTime || '';
            cfg.ver             = cfg.statApp.ver || '';
            cfg.traffic_channel = cfg.statApp.traffic_channel || '';
            cfg.gps             = cfg.statApp.gps || '';
            cfg.network         = cfg.statApp.network || '';
            if (cfg.statApp.session_id) {
                this.setLandingSession(cfg.statApp.session_id);
            }
        }

        /* 获取着陆地址 */
        cfg.landing_url = this.getLandingUrl();
        cfg.session_id = this.getLandingSession();

        var sbParam = this.mix(this.urlConfigParam, cfg);
        //参数拼接
        for (var j in sbParam) {
            if (sbParam[j] == '-9') sbParam[j] = '0';
            mdUrl += "&" + j + "=" + encodeURIComponent(sbParam[j]);
        }

        if (typeof callback != 'function') {
            callback = function () {
            };
        }

        if (navigator.sendBeacon) {
            //优先使用navigator.sendBeacon来发送上报数据
            navigator.sendBeacon(mdUrl, '');
            callback();
        } else {
            //使用new Image发起请求
            var imgObj = new Image();
            var tm;

            try {
                var deferRedirect = new $.Deferred();

                var statComplete = function () {
                    imgObj.removeEventListener('load', statComplete, false);
                    imgObj.removeEventListener('error', statComplete, false);
                    clearTimeout(tm);

                    callback();

                    deferRedirect.resolve();
                }

                imgObj.addEventListener('load', statComplete, false);
                imgObj.addEventListener('error', statComplete, false);
                tm = setTimeout(statComplete, timeout || 1000);

                imgObj.src = mdUrl;

                window._deferRedirect = deferRedirect;

            } catch (e) {

                imgObj.src = mdUrl;

                callback();
            }

        }
    }


    //上报方法  cfg={JSON对象}
    this.shangbao = function (cfg, callback, timeout) {
        this.doShangBao(cfg, callback, timeout);
    }
}

var h5stat = {
    isObj: 0,
    shangbao: function (cfg, callback, timeout) {
        var md = '';
        if (this.isObj) {
            md = this.isObj;
        } else {
            md = new maidian();
            this.isObj = md;
            if (cfg.h5_type == 'edm') {//来自edm
                if (md.getUrlParam('tracking_type') != 'h5_edm') { //不是触屏进入的edm
                    return '';
                }
                var e = md.getUrlParam('type');
                if (e == 'h5_dev' || e == 'h5_test' || e == 'h5_beta') {
                    md.setEnv('test');
                }
            }
            //页面初始化时检测是否需要上传客户端信息
            var iscli = md.isClient();
            if (iscli) {
                var starData = {
                    track_tag_name: '1000',
                    result: '',
                    page_content: '',
                    message: '-9',
                    track_type: '6',
                    remarks: iscli
                };
                md.shangbao(starData, callback, timeout);
            }
        }
        md.shangbao(cfg, callback, timeout);
    },
    getRemarksCfg: function () {
        var md = '';
        if (this.isObj) {
            md = this.isObj;
        } else {
            md = new maidian();
            this.isObj = md;
        }
        return md.getRemarksCfg();
    },
    performanceTracer: function () {
        var jsonData;
        //判断该浏览器是否支持performance api
        if (!('performance' in window)) {
            jsonData = '';
        } else {
            var wp = window.performance || window.webkitPerformance || window.msPerformance || window.mozPerformance,
                pt = wp.timing;
            var propItems = ['navigationStart', 'unloadEventStart', 'unloadEventEnd', 'redirectStart', 'redirectEnd', 'fetchStart', 'domainLookupStart', 'domainLookupEnd', 'connectStart', 'connectEnd', 'secureConnectionStart', 'requestStart', 'responseStart', 'responseEnd', 'domLoading', 'domInteractive', 'domContentLoadedEventStart', 'domContentLoadedEventEnd', 'domComplete', 'loadEventStart', 'loadEventEnd'];
            jsonData = '{';
            for (var i = 0; i < propItems.length; i++) {
                if (pt[propItems[i]] == "undefined" || pt[propItems[i]] == null) {
                    pt[propItems[i]] = 0;
                }
                jsonData += '"pt'+(i + 1)+'":'+pt[propItems[i]]+',';
            }
            jsonData = jsonData.substring(0, jsonData.length - 1);
            jsonData += '}';
        }
        jsonData = JSON.parse(JSON.stringify(jsonData));
        return jsonData;
    }
}

export default h5stat;
