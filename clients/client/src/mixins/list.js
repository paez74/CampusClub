import SuperMethod from './superMethod';
import Credentials from './credentials';
import { events } from '../main';
import {
	formatDate,
	formatStringTime,
	formatCurrency,
	formatPercentageToPercentageNumber
} from '../utils/util';
export default {
	name: 'list',
	mixins: [SuperMethod, Credentials],
	props: {},
	data() {
		return {
			list: [],
			source: [],
			headers: [],
			pagination: {},
			loading: true,
			deleteDialog: false,
			itemToDelete: ''
		};
	},
	methods: {
		snackbar(message) {
			events.$emit('snackbar', message);
		},
		confirmDelete(id) {
			this.itemToDelete = id;
			this.deleteDialog = true;
		},
		goTo(url) {
			var self = this;
			self.$router.push('/' + url);
		},
		formatDate(date) {
			return formatDate(date);
		},
		formatStringTime(time) {
			return formatStringTime(time);
		}
	},
	filters: {
		moment: function(date) {
			return formatDate(date);
		},
		time: function(time) {
			return formatStringTime(time);
		},
		currency: function(value) {
			return formatCurrency(value);
		},
		percentage: function(value) {
			return formatPercentageToPercentageNumber(value);
		}
	},
	computed: {
		filterHeaders: function() {
			var credentials = this.credentials;
			return this.headers.filter((header) => {
				var credentialsKeys = Object.keys(credentials).filter((key) =>
					header.credentials
						? !!header.credentials.find((credential) => credential == key)
						: false
				);
				return credentialsKeys.every((key) => credentials[key]);
			});
		}
	},
	watch: {
		deleteDialog: function(value) {
			if (!value) {
				this.itemToDelete = '';
			}
		}
	}
};
