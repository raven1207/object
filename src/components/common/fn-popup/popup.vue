<template>
    <transition :name="currentTransition">
        <div v-show="currentValue" class="fn-popup" :class="[position ? 'fn-popup-' + position : '']">
            <slot></slot>
        </div>
    </transition>
</template>

<style>
    .fn-popup {
        position: fixed;
        background: #fff;
        top: 50%;
        left: 50%;
        -webkit-transform: translate3d(-50%, -50%, 0);
        transform: translate3d(-50%, -50%, 0);
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        -webkit-transition: .2s ease-out;
        transition: .2s ease-out;
    }
    .fn-popup-top {
        top: 0;
        right: auto;
        bottom: auto;
        left: 50%;
        -webkit-transform: translate3d(-50%, 0, 0);
        transform: translate3d(-50%, 0, 0);
    }
    .fn-popup-right {
        top: 50%;
        right: 0;
        bottom: auto;
        left: auto;
        -webkit-transform: translate3d(0, -50%, 0);
        transform: translate3d(0, -50%, 0);
    }
    .fn-popup-bottom {
        top: auto;
        right: auto;
        bottom: 0;
        left: 50%;
        -webkit-transform: translate3d(-50%, 0, 0);
        transform: translate3d(-50%, 0, 0);
    }
    .fn-popup-left {
        top: 50%;
        right: auto;
        bottom: auto;
        left: 0;
        -webkit-transform: translate3d(0, -50%, 0);
        transform: translate3d(0, -50%, 0);
    }

    .popup-slide-top-enter,
    .popup-slide-top-leave-active {
        transform: translate3d(-50%, -100%, 0);
    }

    .popup-slide-right-enter,
    .popup-slide-right-leave-active {
        transform: translate3d(100%, -50%, 0);
    }

    .popup-slide-bottom-enter,
    .popup-slide-bottom-leave-active {
        transform: translate3d(-50%, 100%, 0);
    }

    .popup-slide-left-enter,
    .popup-slide-left-leave-active {
        transform: translate3d(-100%, -50%, 0);
    }

    .popup-fade-enter,
    .popup-fade-leave-active {
        opacity: 0;
    }
</style>

<script type="text/babel">
    import Popup from 'vue-popup';
    import '../../../assets/css/popup.css';

    export default {
        name: 'mt-popup',

        mixins: [Popup],

        props: {
            modal: {
                default: true
            },

            modalFade: {
                default: false
            },

            lockScroll: {
                default: false
            },

            closeOnClickModal: {
                default: true
            },

            popupTransition: {
                type: String,
                default: 'popup-slide'
            },

            position: {
                type: String,
                default: ''
            }
        },

        data() {
            return {
                currentValue: false,
                currentTransition: this.popupTransition
            };
        },

        watch: {
            currentValue(val) {
                this.$emit('input', val);
            },

            value(val) {
                this.currentValue = val;
            }
        },

        beforeMount() {
            if (this.popupTransition !== 'popup-fade') {
                this.currentTransition = `popup-slide-${ this.position }`;
            }
        },

        mounted() {
            if (this.value) {
                this.rendered = true;
                this.currentValue = true;
                this.open();
            }
        }
    };
</script>
