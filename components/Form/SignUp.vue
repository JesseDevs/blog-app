<script setup>
	// import { useAuthService } from '~/services/AuthService';
	// const auth = useAuthService();
	// const form = reactive({
	// 	email: '',
	// 	password: '',
	// 	successMessage: '',
	// 	errorMessage: '',
	// });
	// async function submit() {
	// 	form.successMessage = '';
	// 	form.errorMessage = '';
	// 	auth.signUpWithEmail(form);
	// }
	// const credentials = reactive({
	// 	firstName: '',
	// 	surname: '',
	// 	email: '',
	// 	password: '',
	// 	passwordRepeat: '',
	// });

	// const client = useSupabaseClient();
	// const router = useRouter();
	// const user = useSupabaseUser();

	// async function login() {
	// 	const { email, password } = credentials;
	// 	const { error } = await client.auth.signInWithPassword({ email, password });
	// 	if (!error) return router.push('/');
	// 	console.log(error);
	// }

	// watchEffect(async () => {
	// 	if (user.value) {
	// 		await router.push('/');
	// 	}
	// });
</script>

<template>
	<!-- <form @submit.prevent="submit()">
		<div class="field">
			<label for="email">Email</label>
			<input id="email" type="email" v-model="form.email" />
		</div>

		<div class="field">
			<label for="password">Password</label>
			<input
				id="password"
				type="password"
				v-model="form.password"
				autocomplete="off"
			/>
		</div>

		<button type="submit">Submit</button>
	</form>

	<div class="success" v-if="form.successMessage">
		{{ form.successMessage }}
	</div>

	<div class="error" v-if="form.errorMessage">
		{{ form.errorMessage }}
	</div> -->
</template>

<style scoped>
	form {
		display: grid;
		gap: 20px;
		max-width: 400px;
		justify-items: start;
	}

	.field {
		display: grid;
	}

	.success {
		color: green;
	}

	.error {
		color: red;
	}
</style>
