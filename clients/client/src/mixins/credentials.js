export default {
	name: 'credentials',
	data() {
		return {
			credentials: JSON.parse(localStorage.getItem('credentials'))
		};
	}
};
