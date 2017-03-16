<template>
    <div class="msgbox-wrapper">
        <transition name="msgbox-bounce">
            <div class="msgbox" v-show="value">
                <div class="msgbox-header" v-if="title !== ''">
                    <div class="msgbox-title">{{ title }}</div>
                </div>
                <div class="msgbox-content" v-if="message !== ''">
                    <div class="msgbox-message" v-html="message"></div>
                    <div class="msgbox-input" v-show="showInput">
                        <input v-model="inputValue" :placeholder="inputPlaceholder" ref="input">
                        <div class="msgbox-errormsg" :style="{ visibility: !!editorErrorMessage ? 'visible' : 'hidden' }">{{ editorErrorMessage }}</div>
                    </div>
                </div>
                <div class="msgbox-btns">
                    <button :class="[ cancelButtonClasses ]" v-show="showCancelButton" @click="handleAction('cancel')">{{ cancelButtonText }}</button>
                    <button :class="[ confirmButtonClasses ]" v-show="showConfirmButton" @click="handleAction('confirm')">{{ confirmButtonText }}</button>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
    @import '~assets/css/vue-msgbox.css';
</style>
<script type="text/ecmascript-6" lang="babel">
    var CONFIRM_TEXT = '确定';
    var CANCEL_TEXT = '取消';

    import Popup from '../fn-popup/index';


    export default {

        mixins: [Popup],

        props: {
            modal: {
                default: true
            },
            lockScroll: {
                default: true
            },
            closeOnPressEscape: {
                default: true
            }
        },

        computed: {
            confirmButtonClasses() {
                var classes = 'msgbox-btn msgbox-confirm ' + this.confirmButtonClass;
                if (this.confirmButtonHighlight) {
                    classes += ' msgbox-confirm-highlight';
                }
                return classes;
            },
            cancelButtonClasses() {
                var classes = 'msgbox-btn msgbox-cancel ' + this.cancelButtonClass;
                if (this.cancelButtonHighlight) {
                    classes += ' msgbox-cancel-highlight';
                }
                return classes;
            }
        },

        methods: {
            handleAction(action) {
                if (this.$type === 'prompt' && action === 'confirm' && !this.validate()) {
                    return;
                }
                var callback = this.callback;
                this.visible = false;
                callback(action);
            },

            validate() {
                if (this.$type === 'prompt') {
                    var inputPattern = this.inputPattern;
                    if (inputPattern && !inputPattern.test(this.inputValue || '')) {
                        this.editorErrorMessage = this.inputErrorMessage || '输入的数据不合法!';
                        return false;
                    }
                    var inputValidator = this.inputValidator;
                    if (typeof inputValidator === 'function') {
                        var validateResult = inputValidator(this.inputValue);
                        if (validateResult === false) {
                            this.editorErrorMessage = this.inputErrorMessage || '输入的数据不合法!';
                            return false;
                        }
                        if (typeof validateResult === 'string') {
                            this.editorErrorMessage = validateResult;
                            return false;
                        }
                    }
                }
                this.editorErrorMessage = '';
                return true;
            }
        },

        watch: {
            inputValue() {
                if (this.$type === 'prompt') {
                    this.validate();
                }
            },

            visible(val) {
                if (val && this.$type === 'prompt') {
                    setTimeout(() => {
                        if (this.$els.input) {
                            this.$els.input.focus();
                        }
                    }, 500);
                }
            }
        },

        data() {
            return {
                title: '',
                message: '',
                type: '',
                showInput: false,
                inputValue: null,
                inputType: 'text',
                inputPlaceholder: '',
                inputPattern: null,
                inputValidator: null,
                inputErrorMessage: '',
                showConfirmButton: true,
                showCancelButton: false,
                confirmButtonText: CONFIRM_TEXT,
                cancelButtonText: CANCEL_TEXT,
                confirmButtonPosition: 'right',
                confirmButtonHighlight: false,
                confirmButtonClass: '',
                confirmButtonDisabled: false,
                cancelButtonClass: '',
                cancelButtonHighlight: false,
                editorErrorMessage: null,
                callback: null
            };
        }
    }
</script>
