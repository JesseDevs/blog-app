export default function ({ route, redirect }) {
	if (!route || !route.query) {
		console.error('Route or query is undefined');
		return navigateTo('/');
	}

	const code = route.query.code;
	if (!code) {
		return navigateTo('/');
	}
}
