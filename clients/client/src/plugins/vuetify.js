import Vue from 'vue';
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  VMenu,
  VTextField,
  VSnackbar,
  VForm,
  VDataTable,
  VProgressLinear,
  VAlert,
  VDialog,
  VCard,
  VCheckbox,
  VSwitch,
  VDatePicker,
  VTimePicker,
  VSelect,
  VTextarea,
  transitions,
  VImg,
  VBadge,
  VExpansionPanel,
  VDivider,
  VProgressCircular,
  VSpeedDial,
  VAvatar,
  VTabs
} from 'vuetify';
import 'vuetify/src/stylus/app.styl';
import { i18n } from '../utils/locales/default';
import { Ripple } from 'vuetify/lib/directives';

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VMenu,
    VTextField,
    VSnackbar,
    VForm,
    VDataTable,
    VProgressLinear,
    VAlert,
    VDialog,
    VCard,
    VCheckbox,
    VSwitch,
    VDatePicker,
    VTimePicker,
    VSelect,
    VTextarea,
    transitions,
    VImg,
    VBadge,
    VExpansionPanel,
    VDivider,
    VProgressCircular,
    VSpeedDial,
    VAvatar,
    VTabs
  },
  theme: {
    primary: '#0b5394',
    secondary: '#666666',
    accent: '#6aa84f',
    error: '#990000',
    info: '#f3f3f3',
    success: '#00ff00',
    warning: '#f6b26b',
    menuBackground: '#ffffff',
    menuText: '#666666',
    menuSelectedText: '#0b5394',
    menuSelectedItem: '#a4c2f4'
  },
  options: {
    customProperties: true
  },
  lang: {
    t: (key, ...params) => i18n.t(key, params)
  },
  directives: {
    Ripple
  }
});
