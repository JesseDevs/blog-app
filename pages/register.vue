<script setup>
	const credentials = reactive({
		fullName: '',
		username: '',
		email: '',
		password: '',
		successMessage: '',
		errorMessage: '',
	});

	const client = useSupabaseClient();
	const router = useRouter();
	const user = useSupabaseUser();
	async function register() {
		const { fullName, username, email, password } = credentials;
		const { error } = await client.auth.signUp({
			email,
			password,
			options: {
				data: {
					full_name: fullName,
					username: username.toLocaleLowerCase(),
					email,
					likes: [],
				},
				emailRedirectTo: 'http://localhost:3000/',
			},
		});

		if (error) {
			if (error.message.includes('unique constraint')) {
				credentials.errorMessage = 'Email or username already exists.';
			} else {
				credentials.errorMessage = 'Registration failed. Please try again.';
			}
			console.error(error);
			return;
		}
		isModalOpen.value = true;
	}

	const isModalOpen = ref(false);
	const closeModal = () => {
		isModalOpen.value = false;
	};

	const showPassword = ref(false);
	const togglePassword = () => {
		if (credentials.password) {
			showPassword.value = !showPassword.value;
		}
	};
</script>

<template>
	<GeneralContainer class="register">
		<signup-page>
			<div>
				<h2 class="level-three-voice">Sign Up</h2>
				<p class="sub-head">Get started with an account</p>
			</div>
			<form @submit.prevent="register()">
				<div class="field">
					<label for="email">Email <span class="required">*</span></label>
					<input
						id="email"
						required
						type="email"
						placeholder="Email"
						v-model="credentials.email"
						aria-label="Email"
					/>
				</div>
				<div class="field">
					<label for="fullName">Full Name</label>
					<input
						type="text"
						id="fullName"
						placeholder="Full Name"
						v-model="credentials.fullName"
						aria-label="Full Name"
					/>
				</div>
				<div class="field">
					<label for="username">Username</label>
					<input
						type="text"
						id="username"
						placeholder="Username"
						v-model="credentials.username"
						aria-label="Username"
					/>
				</div>
				<div class="field">
					<label for="password">Password <span class="required">*</span></label>
					<input
						id="password"
						required
						:type="showPassword ? 'text' : 'password'"
						placeholder="Enter your password"
						v-model="credentials.password"
						autocomplete="off"
						aria-label="Password"
					/>
					<button class="showBTN" @click.prevent="togglePassword">
						<Icon
							:name="`${showPassword ? 'mi:eye' : 'mi:eye-off'}`"
							color="rgb(128, 127, 127)"
							size="28"
						/>
					</button>
				</div>
				<p class="form-support small-voice">
					By signing up, you agree to the
					<a class="small-voice" href="/settings/terms">Terms of Service</a>
					and
					<a class="small-voice" href="/settings/privacy">Privacy Policy</a>
				</p>
				<button class="button-filled" type="submit">Submit</button>
			</form>
			<div class="error" v-if="credentials.errorMessage">
				<p>{{ credentials.errorMessage }}</p>
			</div>
			<glass-container
				v-if="credentials.successMessage && isModalOpen"
				:class="{ success: isModalOpen }"
			>
				<h3 class="level-two-voice">Confirmation</h3>
				<button @click="closeModal">Close</button>
				<p>{{ credentials.successMessage }}</p>
			</glass-container>
		</signup-page>
	</GeneralContainer>
</template>

<style lang="scss" scoped>
	section {
		min-height: 100vh;
	}

	signup-page {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 2rem;

		.sub-head {
			opacity: 0.75;
		}
	}

	form {
		display: flex;
		flex-direction: column;
		max-width: 400px;
		justify-items: start;

		span.required {
			color: red;
		}

		.field {
			display: flex;
			margin-bottom: 15px;
			flex-direction: column;
			width: 100%;
			gap: 5px;
			position: relative;

			&:last-of-type {
				margin-bottom: 8px;
			}

			input {
				font-family: 'Roboto Slab', serif;
				width: 100%;
				padding: 8px 1rem;
				font-size: var(--size-base);
				background-color: var(--light-fade);
				border: none;
				outline: none;

				&::placeholder {
					color: rgb(101, 101, 101);
				}

				&:focus {
					outline: 1px solid rgb(128, 127, 127);
				}
			}
		}

		.form-support {
			margin-bottom: 30px;

			a {
				font-size: inherit;
				text-decoration: underline;
			}
		}
	}

	.showBTN {
		background: transparent;
		color: black;
		position: absolute;
		bottom: 7px;
		right: 5px;
		padding: 0 5px;
		border: none;
		outline: none;
		cursor: pointer;
	}

	glass-container.success {
		opacity: 1;
		pointer-events: auto;
		transition: opacity 0.01s ease;
	}

	.success {
		color: green;
	}

	.error {
		color: red;
	}
</style>
