import SuperMethod from './superMethod';
import Credentials from './credentials';
import { events } from '../main';
export default {
	name: 'modal',
	mixins: [SuperMethod, Credentials],
	props: {},
	data() {
		return {
			dialog: true
		};
	},
	methods: {
		snackbar(message) {
			events.$emit('snackbar', message);
		},
		goBack() {
			this.$emit('close');
		}
	},
	watch: {
		dialog(val) {
			!val && this.$emit('close');
		}
	}
};
