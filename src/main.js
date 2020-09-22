import Vue from 'vue';
import VisualFlow from 'vue-visual-flow';
import App from './App.vue';

Vue.use(VisualFlow);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
