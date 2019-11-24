import Vue from 'vue';
import VueI18n from 'vue-i18n';
import messageEn from './en/message';
import vuetifyEn from 'vuetify/es5/locale/en';
import vuetifyEsMx from './es-mx/vuetify';
import messageEsMx from './es-mx/message';

Vue.use(VueI18n);

const messages = {
	en: {
		$vuetify: vuetifyEn,
		message: messageEn
	},
	'es-mx': {
		$vuetify: vuetifyEsMx,
		message: messageEsMx
	}
};

export const i18n = new VueI18n({
	locale: 'es-mx',
	messages
});
