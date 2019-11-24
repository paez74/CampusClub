import { expect } from 'chai';
import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import App from '@/App.vue';

import router from '@/router/index';
import LocalStorageMock from '../LocalStorageMock';

global.localStorage = new LocalStorageMock();
var credentials = {};

global.localStorage.setItem('credentials', credentials);

describe('App.vue', () => {
	const $route = {
		path: '/',
		hash: '',
		params: {},
		query: {}
	};
	const localVue = createLocalVue();
	it('mount it', () => {
		const wrapper = mount(App, {
			localVue,
			router,
			mocks: {}
		});
	});
});
