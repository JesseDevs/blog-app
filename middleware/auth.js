export default defineNuxtRouteMiddleware((to, from) => {
	const user = useSupabaseUser();

	if (user.value) {
		return;
	}
	console.log('redirect 2');
	return navigateTo('/login');
});
