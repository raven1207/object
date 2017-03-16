<template>
    <div>
        <ul class="fixedbtn" id="J_fixedBtn">
            <li class="search hide_it" id="J_newBtnSearch"></li>
            <li class="homepage hide_it" id="J_newBtnHomepage"></li>
            <li class="footprint hide_it" id="J_newBtnFootprint"></li>
            <li class="cart" id="J_newBtnCart" @click="btnCart">
                <b class="J_navCartNumId">
                {{cartNumber > 99 ? '99+' : cartNumber}}
            </b>
            </li>
            <li class="top" :class="classes" id="J_newBtnTop" @click="J_newBtnTop"></li>
        </ul>
    </div>
</template>
<style>
    .fixedbtn li b {
        display: inline;
        transform-origin: 0px 0px 0px;
        opacity: 1;
        transform: scale(1, 1);
        position: absolute;
        right: .01rem;
        top: .01rem;
        min-width: .37rem;
        height: .37rem;
        line-height: .37rem;
        display: block;
        background: #c70034;
        font-size: .18rem;
        border-radius: 50%;
        color: #fff;
        font-weight: 400;
        text-align: center;
    }
</style>
<script>
    export default{
        props: {
            cartNumber: Number
        },
        data(){
            return {
                hide: true
            }
        },
        computed: {
            classes () {
                return {
                    'hide_it': this.hide
                }

            }
        },
        methods: {
            J_newBtnTop(){
                document.body.scrollTop = 0;
                return false;
            },
            btnCart(){
                window.location = 'http://m.beta1.fn/cart/';
            }
        },
        mounted(){
            let me = this;
            window.addEventListener('scroll', function () {
                document.body.scrollTop >= 100 ? me.hide = false : me.hide = true
            })

        }
    }
</script>
