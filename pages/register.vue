<template>
	<GeneralContainer class="register">
		<signup-page v-if="!isDataLoading">
			<div>
				<h2 class="level-three-voice">Sign Up</h2>
				<p class="sub-head">Get started with an account</p>
			</div>
			<form @submit.prevent="register()" autocomplete="off">
				<div class="field">
					<label for="email">Email <span class="required">*</span></label>
					<input
						id="email"
						required
						type="email"
						placeholder="Email"
						autocomplete="off"
						v-model="credentials.email"
						aria-label="Email"
					/>
				</div>
				<div class="field">
					<label for="fullName"
						>Full Name <span class="required">*</span></label
					>
					<input
						type="text"
						id="fullName"
						required
						placeholder="Full Name"
						autocomplete="off"
						v-model="credentials.fullName"
						aria-label="Full Name"
					/>
				</div>
				<div class="field">
					<label for="username">Username <span class="required">*</span></label>
					<input
						type="text"
						id="username"
						required
						placeholder="Username"
						autocomplete="off"
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
							color="var(--outline-color)"
							size="28"
						/>
					</button>
				</div>
				<p class="form-support small-voice">
					By signing up, you agree to the
					<NuxtLink class="small-voice" to="/settings/terms"
						>Terms of Service</NuxtLink
					>
					and
					<NuxtLink class="small-voice" to="/settings/privacy"
						>Privacy Policy</NuxtLink
					>
				</p>
				<button class="button-filled submit-btn" type="submit">Submit</button>
			</form>
			<div class="error" v-if="credentials.errorMessage">
				<p>{{ errorMessage }}</p>
				<p>{{ credentials.errorMessage }}</p>
			</div>

			<p class="form-support small-voice">
				Already have an account?
				<NuxtLink class="custom-link" to="/login">Login</NuxtLink>
			</p>
		</signup-page>

		<LoadingContainer v-else :text="loadingText" />
	</GeneralContainer>
</template>
<script setup>
	const credentials = reactive({
		fullName: '',
		username: '',
		email: '',
		password: '',
		successMessage: '',
		errorMessage: '',
	});

	definePageMeta({
		middleware: 'confirmed-auth',
	});

	const errorMessage = ref('');
	const client = useSupabaseClient();
	const router = useRouter();
	const user = useSupabaseUser();
	const isDataLoading = ref(false);
	const loadingText = ref(`Creating your account...`);

	async function register() {
		isDataLoading.value = true;
		const { fullName, username, email, password } = credentials;
		const { error } = await client.auth.signUp({
			email,
			password,
			options: {
				data: {
					full_name: fullName,
					username: username,
					email,
				},
				redirectTo: 'https://echo-waves.vercel.app/',
			},
		});

		if (error) {
			errorMessage.value = error.message;
			credentials.errorMessage = 'Registration failed. Please try again.';
			console.error(error);
		} else {
			isDataLoading.value = false;
			router.push('/confirmation');
		}
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
		a {
			font-size: inherit;
			text-decoration: underline;
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

	p.form-support {
		.custom-link {
			font-size: inherit;
			position: relative;
			display: inline-block;
			text-decoration: underline;
			transition: color 0.4s ease;
			padding-left: 5px;
			padding-right: 5px;

			&:hover {
				color: black;
			}
		}

		.custom-link::before {
			content: '';
			position: absolute;
			border-radius: 3px;
			top: 0;
			left: 0;
			width: 0;
			height: 100%;
			background-color: var(--button-bg);
			transition: width 0.3s ease;
			// transition-delay: 0.1s;
			z-index: -1;
		}

		.custom-link:hover::before {
			width: 100%;
		}
	}

	glass-container.success {
		opacity: 1;
		pointer-events: auto;
		transition: opacity 0.01s ease;
	}

	.success {
		color: var(--success-green);
	}

	.error {
		color: var(--required-red);
	}
</style>
