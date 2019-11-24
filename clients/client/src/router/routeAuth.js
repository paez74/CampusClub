/**
 * Router Authentication Configuration
 */

const routerAuth = {};

let currentEvents;

routerAuth.applyRules = (router) => {
	router.beforeEach((to, from, next) => {
		if (!to.meta.requiresAuth) {
			next();
			return;
		}
		if (!localStorage.getItem('token')) {
			currentEvents.$emit('closeSession', to.fullPath);
			return;
		}
		const allowedToContinue = getStatusPermission(to, from, next);
		if (!allowedToContinue && from.name === 'login') {
			next({
				path: '/'
			});
		} else if (allowedToContinue) {
			next();
		} else {
			currentEvents.$emit('closeSession');
		}
	});
};

routerAuth.setEvents = (events) => {
	currentEvents = events;
};

function getStatusPermission(to, from, next) {
	let credentials = JSON.parse(localStorage.getItem('credentials'));
	const authRequirements = to.meta.credentials;
	const allowedToContinue = authRequirements.some((request) => {
		return credentials[request];
	});
	return allowedToContinue;
}

module.exports = routerAuth;
