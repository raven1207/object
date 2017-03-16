<template>
    <i>
        <!--列表页显示当前浏览页数-->
        <div class="paging" v-show="isPageToast" transition="fade" id="page_area"
            style="transform-origin: 0px 0px 0px; transform: scale(1, 1);">
            <span v-if="!noShop">{{pageScanInfo}}</span>
            <!-- <span v-else-if>{{pageNo}}</span> -->
        </div>
        <!-- 加载提示符 -->
        <div v-show="bottomLoading">
            <p class="loading_btm"><b></b><i>正在努力刷新数据中...</i></p>
        </div>
    </i>
</template>
<script>
    import {mapMutations, mapState} from 'vuex'
    import {getScrollHeight, getWindowHeight, getScrollTop} from "../../util/scroll";
    import _ from "lodash";
    let pagenumShowTimeOutId=null;//列表数据滚动时显示分页提示
    export default{
        data(){
            return {
                isPageToast: false,
                scanPageNow: 1//用户浏览的当前页数
            }
        },
        mounted(){
            window.addEventListener('scroll', _.throttle(this.pageHide),200)
        },
        computed:{
            ...mapState({
                currentPage: state => state.list.currentPage,
                totalPageSize: state => state.list.totalPageSize,
                noShop: state => state.list.noShop,
                bottomLoading: state => state.list.bottomLoading
            }),
            //返回当前浏览页数信息
            pageScanInfo(){
                return this.scanPageNow + '/' + this.totalPageSize
            },
            pageNo(){
                return 1+'/'+1;
            }
        },
        methods: {
            //计算用户浏览的当前页
            computeScanPage(){
                const currentHeight = getScrollTop() + getWindowHeight();
                const liEle = document.querySelectorAll('.actslist li');
                const liNum = liEle.length;
                if (liNum === 0) {
                    return false;
                }
                const liHeight = liEle[0].offsetHeight;
                let severalLi = Math.floor((currentHeight / liHeight) - 1);
                severalLi = severalLi >= liNum ? (liNum - 1) : severalLi;
                this.scanPageNow = liEle[severalLi].getAttribute('page-index');
            },
            //隐藏分页提示
            pageHide(){
                const me = this;
                me.computeScanPage();
                me.isPageToast = true;
                if (pagenumShowTimeOutId) {
                    clearTimeout(pagenumShowTimeOutId);
                }
                pagenumShowTimeOutId = setTimeout(function () {
                    me.isPageToast = false;
                }, 1000);
            }
        }
    }
</script>
