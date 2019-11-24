import SuperMethod from './superMethod';
import Credentials from './credentials';
import { events } from '../main';
import {
	formatDate,
	formatDateToTimeOnly,
	decimal_config,
	currency_config
} from '../utils/util';
export default {
	name: 'form',
	mixins: [SuperMethod, Credentials],
	props: {},
	data() {
		return {
			formatDate,
			decimal_config,
			currency_config,
			title: 'Agregar',
			valid: true,
			sending: false,
			view: false,
			id: '',
			form: {}
		};
	},
	methods: {
		snackbar(message) {
			events.$emit('snackbar', message);
		},
		goTo(url) {
			this.$router.push(url);
		},
		goBack() {
			window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
		},
		checkMaxSafeInteger(event){
			const SAFE_KEYS = [8, 9, 13, 16, 17, 18, 46];
			const valueLength = event.target.value.replace(/,/g, '').length;
			const limitLength = String(Number.MAX_SAFE_INTEGER).length;

			// Disable key event to avoid number overflow
			if (valueLength < limitLength || SAFE_KEYS.includes(event.keyCode)) {
				return true;
			} else {
				event.preventDefault();
				return false;
			}
    }
	},
	mounted() {
		this.id = this.$route.params.id;
		if (this.$route.name.includes('detail')) {
			this.view = true;
			this.title = 'Visualizar';
		} else if (this.$route.name.includes('edit')) {
			this.view = false;
			this.title = 'Modificar';
		}

		this.dataInit();
	},
	filters: {
		moment: function(date) {
			return formatDate(date);
		},
		dateToTimeOnly: function(date) {
			return formatDateToTimeOnly(date);
		}
	}
};
