import '@babel/polyfill';
import Vue from 'vue';
import './plugins/vuetify';
import { i18n } from './utils/locales/default';
import Vuelidate from 'vuelidate';
import VueResource from 'vue-resource';
import App from './App.vue';
import router from './router';
import moment from 'moment-timezone';
import Croppa from 'vue-croppa';
import currency from 'v-currency-field';
import 'vue-swatches/dist/vue-swatches.min.css';
import 'vue-croppa/dist/vue-croppa.css';
import 'v-currency-field/dist/index.css';

//Components
import ImageCroppaPicker from './components/imageCroppaPicker';
import IconPicker from './components/icon-picker';
import ColorPicker from './components/colorPicker';
import DatePicker from './components/date-picker';
import TimePicker from './components/time-picker';
import PercentageField from './components/percentage-field';
import ImagePreview from './components/modals/image-preview';
import FilePicker from './components/file-picker';

const routeAuth = require('./router/routeAuth');

Vue.config.productionTip = false;
Vue.use(Vuelidate);
Vue.use(VueResource);
Vue.use(Croppa);
Vue.use(currency);

Vue.component('image-croppa-picker', ImageCroppaPicker);
Vue.component('icon-picker', IconPicker);
Vue.component('color-picker', ColorPicker);
Vue.component('date-picker', DatePicker);
Vue.component('time-picker', TimePicker);
Vue.component('percentage-field', PercentageField);
Vue.component('image-preview', ImagePreview);
Vue.component('file-picker', FilePicker);

Vue.http.options.root = 'api/';

Vue.http.interceptors.push((request, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    request.headers.set('Authorization', 'Bearer ' + token);
  }

  next((response) => {
    if (router.currentRoute.name === 'login') return;
    if (response.status === 403) {
      events.$emit('closeSession');
    } else if (response.status === 401) {
      events.$emit('closeSession', router.currentRoute.path);
    }
  });
});

export const headers = Vue.http.headers.common;

export const events = new Vue();

events.$on('closeSession', (fullPath) => {
  localStorage.removeItem('userId');
  localStorage.removeItem('token');
  localStorage.removeItem('credentials');
  if (fullPath) {
    router.push({ path: '/login', query: { redirect: fullPath } });
  } else {
    router.push('login');
  }
});

routeAuth.setEvents(events);
routeAuth.applyRules(router);

new Vue({
  i18n,
  router,
  render: (h) => h(App)
}).$mount('#app');
