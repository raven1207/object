<style>
    .slider-container {
        margin: 0 auto;
        overflow: hidden;
        position: relative;
        z-index: 1;
    }

    .guess_love {
        padding: .25rem .24rem .2rem;
    }
    .guess_love .gl_title {
        font-size: .28rem;
        margin-bottom: .2rem;
        color: #333;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
    }
    .guess_love .gl_title div:first-child {
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
    }

    .slider-center-center {
        margin: auto;
        z-index: 1;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .slider-wrapper {
        box-sizing: content-box;
        display: flex;
        height: 100%;
        position: relative;
        transition-property: transform;
        width: 100%;
        z-index: 1;
    }

    .slider-item {
        flex-shrink: 0;
        width: 25%;
        float: left;
        position: relative;
    }

    .animation-ease {
        -webkit-transition: -webkit-transform 350ms cubic-bezier(.165, .84, .44, 1);
        transition: transform 350ms cubic-bezier(.165, .84, .44, 1);
    }

    .slider-item a {
        max-width: 1.6rem;
        padding: 0 .05rem;
        display: block;
        margin: 0 auto;
    }

    .slider-item img {
        max-width: 100%;
        margin: 0 auto;
        height: 1.5rem;
    }

    .gl_name {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height: .34rem;
        font-size: .24rem;
        color: #666;
        font-weight: 100;
        margin: .07rem 0 .06rem;
        height: .68rem;
    }

    .gl_price {
        color: #c70034;
        font-size: .24rem;
    }

</style>
<template>


        <div class='slider-container' :class='basicdata.containerClass'>
            <div class="slider-wrapper"
                 :style="styleobj"
                 :class="basicdata.animation"
                 @touchmove="swipeMove"
                 @touchstart="swipeStart"
                 @touchend="swipeEnd"
                 @mousedown.stop="swipeStart"
                 @mouseup.stop="swipeEnd"
                 @mousemove.stop="swipeMove">
                <!-- 正常滚动 -->
                <template v-if="!sliderinit.loop">
                    <template v-for="item in pages">
                        <div class="slider-item">
                            <a :href="item | pageJump">
                                <div class="gl_img">
                                    <img :src="item.sm_pic"
                                         :title="item.sm_name"></div>
                                <h4 class="gl_name">{{item.sm_name}}</h4>
                                <p class="gl_price">￥{{item.sm_price}}</p>
                            </a>
                        </div>
                    </template>
                </template>

            </div>

        </div>


</template>
<script>
    export default {
        props: ['sliderinit', 'pages'],
        data(){
            return {
                basicdata: {
                    poswidth: '0',
                    posheight: '0',
                    animation: {
                        'animation-ease': false
                    }
                }
            }
        },
        computed: {

            // 动画执行obj
            styleobj: function () {
                return {'transform': 'translate3D(' + this.basicdata.poswidth + ',' + this.basicdata.posheight + ',0)'}
            },
            // pagenum滑动数
            pagenums: function () {
                return this.pages.length / 4
            },
            // 组件的核心，计算当前父级需要进行的偏移,每次要遍历节点,应该直接储存节点，提高性能
            currentWidth: {
                get: function () {
                    let poswidth = 0;
                    let $slider;
                    let lastPage = this.sliderinit.currentPage - 1;
                    let srollbar = false;

                    // 获取slideritem子集
                    for (let item in this.$el.children) {
                        if (/slider-wrapper/ig.test(this.$el.children[item].className)) {
                            $slider = this.$el.children[item]
                        }
                    }
                    // 遍历子集
                    let $sliderChildren = $slider.children;
                    for (let item in $sliderChildren) {
                        if (item <= lastPage) {
                            // 找到实际宽度clientWidth+外边距
                            poswidth += ($sliderChildren[item].offsetWidth) * 4;
                            poswidth += parseInt($sliderChildren[item].style.marginRight.length ? $sliderChildren[item].style.marginRight : 0);
                            poswidth += parseInt($sliderChildren[item].style.marginLeft.length ? $sliderChildren[item].style.marginLeft : 0);
                        }
                    }
                    return poswidth
                },
                set: function (value) {
                    return value;
                }
            }

        },
        filters:{
            pageJump(item){
                return $.config.mDomain +'/item/'+item.sm_seq;
            }
        },
        ready () {
            //起始跳到指定页 更新为无样式的了,更符合常理
            this.slide(0, 'animationnone')
            //定制事件
        },
        methods: {
            swipeStart (e) {
                this.basicdata.animation['animation-ease'] = false;

                // 阻止页面滚动
                document.addEventListener('touchmove', e.preventDefault());
                if (e.type === 'touchstart') {

                    if (e.touches.length > 1) {
                        this.sliderinit.tracking = false;
                        return;
                    } else {
                        this.sliderinit.tracking = true;
                        /* Hack - would normally use e.timeStamp but it's whack in Fx/Android */
                        this.sliderinit.start.t = new Date().getTime();
                        this.sliderinit.start.x = e.targetTouches[0].clientX;
                        this.sliderinit.start.y = e.targetTouches[0].clientY;
                        this.sliderinit.end.x = e.targetTouches[0].clientX;
                        this.sliderinit.end.y = e.targetTouches[0].clientY;
                    }
                } else {

                    this.sliderinit.tracking = true;
                    /* Hack - would normally use e.timeStamp but it's whack in Fx/Android */
                    this.sliderinit.start.t = new Date().getTime();
                    this.sliderinit.start.x = e.clientX;
                    this.sliderinit.start.y = e.clientY;
                    this.sliderinit.end.x = e.clientX;
                    this.sliderinit.end.y = e.clientY;
                }
            },
            swipeMove (e) {

                if (this.sliderinit.tracking) {
                    if (e.type === 'touchmove') {
                        e.preventDefault();
                        this.sliderinit.end.x = e.targetTouches[0].clientX;
                        this.sliderinit.end.y = e.targetTouches[0].clientY;
                    } else {
                        e.preventDefault();
                        this.sliderinit.end.x = e.clientX;
                        this.sliderinit.end.y = e.clientY;
                    }
                    this.basicdata.poswidth = -(this.currentWidth) + this.sliderinit.end.x - this.sliderinit.start.x + 'px';
                }
            },
            swipeEnd (e) {
                this.sliderinit.tracking = false;
                let now = new Date().getTime();
                let deltaTime = now - this.sliderinit.start.t;
                let deltaX = this.sliderinit.end.x - this.sliderinit.start.x;
                let deltaY = this.sliderinit.end.y - this.sliderinit.start.y;

                // 解除阻止
                document.removeEventListener('touchmove', e.preventDefault());
                /* work out what the movement was */
                if (deltaTime > this.sliderinit.thresholdTime) {
                    this.slide(this.sliderinit.currentPage);
                    /* gesture too slow */
                    return;
                } else if ((deltaX > this.sliderinit.thresholdDistance) && (Math.abs(deltaY) < this.sliderinit.thresholdDistance)) {
                    //swipe right
                    this.pre();
                    return
                } else if ((-deltaX > this.sliderinit.thresholdDistance) && (Math.abs(deltaY) < this.sliderinit.thresholdDistance)) {
                    //swipe left
                    this.next();
                    return
                } else {
                    this.slide(this.sliderinit.currentPage);
                    return
                }


            },
            pre () {
                if (this.sliderinit.currentPage != 0) {
                    this.sliderinit.currentPage -= 1;
                    this.slide();
                } else {
                    this.slide();
                }

            },
            next () {

                if (this.sliderinit.currentPage != this.pagenums - 1) {
                    this.sliderinit.currentPage += 1;
                    this.slide();
                } else {
                    this.slide();
                }
            },
            slide(pagenum, type){
                //执行动画
                this.basicdata.animation['animation-ease'] = true;
                // 无样式滚动
                if (type == 'animationnone') {
                    this.basicdata.animation['animation-ease'] = false;
                }
                if (pagenum || pagenum == 0) {
                    this.sliderinit.currentPage = pagenum;
                }
                // 增加垂直滚动判定

                this.basicdata.poswidth = -this.currentWidth + 'px';
            }
        }

    }
</script>
