/**
 * Created by KE on 16/11/11.
 */
import MessageBox from "./components/common/fn-msgbox/index";
import Toast from "./components/common/fn-toast/index";
import VueClickoutside from 'vue-clickoutside';

// or custom directive id
const install = function(Vue) {
  if (install.installed) return;

  Vue.use(VueClickoutside);

  Vue.directive('click-outside', {
    acceptStatement: true,
    priority: 700,
    bind: function () {
      Vue.util.on(document, 'click', this.handler, true)
    },
    update: function (onClickOutside) {
      if (!this.descriptor.raw) {
        onClickOutside = function () {}
      }
      this.unbind()
      var el = this.el
      this.handler = function (e) {
        if (el && !el.contains(e.target)) onClickOutside(e)
      }
      this.bind()
    },
    unbind: function () {
      Vue.util.off(document, 'click', this.handler, true)
    }
  })

  Vue.$messagebox = Vue.prototype.$messagebox = $.$messagebox = MessageBox;
  Vue.$toast = Vue.prototype.$toast = $.toast = Toast;

};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
};

module.exports = {
  install,
  MessageBox,
  Toast
};
