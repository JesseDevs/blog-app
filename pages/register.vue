<script setup>
	const credentials = reactive({
		firstName: '',
		surname: '',
		email: '',
		password: '',
		passwordRepeat: '',
		successMessage: '',
		errorMessage: '',
	});

	const client = useSupabaseClient();
	const router = useRouter();
	const user = useSupabaseUser();
	async function register() {
		const { firstName, surname, email, password, passwordRepeat } = credentials;
		if (password !== passwordRepeat) return;
		const { error } = await client.auth.signUp({
			email,
			password,
			options: {
				data: {
					first_name: firstName,
					surname,
					email,
				},
				emailRedirectTo: 'http://localhost:3000/',
			},
		});
		if (error) {
			alert('Something went wrong !');
			return;
		}
		alert('Open the email we sent you to verify your account!');
	}
</script>

<template>
	<section class="register">
		<inner-column>
			<form @submit.prevent="register()">
				<div class="field">
					<label for="first-name">First Name</label>
					<input type="text" id="first-name" v-model="credentials.firstName" />
				</div>
				<div class="field">
					<label for="surname">Last Name</label>
					<input type="text" id="surname" v-model="credentials.surname" />
				</div>
				<div class="field">
					<label for="email">Email</label>
					<input id="email" type="email" v-model="credentials.email" />
				</div>

				<div class="field">
					<label for="password">Password</label>
					<input
						id="password"
						type="password"
						v-model="credentials.password"
						autocomplete="off"
					/>
				</div>
				<div class="field">
					<label for="repeat-password">Password</label>
					<input
						id="repeat-password"
						type="password"
						v-model="credentials.passwordRepeat"
						autocomplete="off"
					/>
				</div>

				<button type="submit">Submit</button>
			</form>

			<div class="success" v-if="credentials.successMessage">
				{{ credentials.successMessage }}
			</div>

			<div class="error" v-if="credentials.errorMessage">
				{{ credentials.errorMessage }}
			</div>
		</inner-column>
	</section>
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
