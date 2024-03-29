<template>
	<section class="register" @click="handleOutsidePasswordModal">
		<inner-column>
			<login-page>
				<div>
					<h2 class="level-three-voice">Login</h2>
					<p class="sub-head">
						Enter your email and password to access your dashboard.
					</p>
				</div>
				<form @submit.prevent="signInWithEmail()">
					<div class="field">
						<label for="email">Email<span class="required"> *</span></label>
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
						<label for="password"
							>Password<span class="required"> *</span></label
						>
						<input
							id="password"
							required
							:type="showPassword ? 'text' : 'password'"
							placeholder="Enter your password"
							v-model="credentials.password"
							autocomplete="off"
							aria-label="Password"
						/>
						<button
							class="showBTN"
							type="button"
							@click.prevent="togglePassword"
						>
							<Icon
								:name="`${showPassword ? 'mi:eye' : 'mi:eye-off'}`"
								color="var(--outline-color)"
								size="28"
							/>
						</button>
					</div>
					<button class="button-filled submit-btn" type="submit">Submit</button>
				</form>

				<div class="login-footer" id="login-footer">
					<p class="form-support small-voice">
						Forgot your
						<button
							class="footer-action"
							type="button"
							@click="toggleResetBlock"
						>
							password
						</button>
						?
					</p>
					<p class="form-support small-voice">
						Don't have an account?
						<NuxtLink class="footer-action" to="/register">Sign Up</NuxtLink>
					</p>

					<p class="error-message" v-if="loginError">{{ loginError }}</p>
				</div>
			</login-page>
		</inner-column>

		<transition name="move">
			<password-modal
				class="modal"
				id="password-modal"
				v-if="resetBlock"
				:class="{ open: resetBlock }"
				@click.stop
			>
				<inner-column>
					<button class="close-btn" @click="toggleResetBlock">
						<Icon name="carbon:close" size="21" />
					</button>

					<div>
						<h2 class="level-three-voice">Reset Password</h2>
						<p class="sub-head">
							We will send your password reset information to your email
						</p>
					</div>
					<form @submit.prevent="resetPassword">
						<div class="field">
							<label for="email-reset"> Enter your email </label>
							<input
								id="email-reset"
								type="email"
								placeholder="Email"
								v-model="credentials.email"
								autocomplete="off"
								aria-label="Email-reset"
							/>
						</div>
						<button
							class="button-filled submit-btn"
							type="submit"
							:disabled="disabled"
						>
							Submit
						</button>
					</form>
				</inner-column>
			</password-modal>
		</transition>
	</section>
</template>

<script setup>
	definePageMeta({
		middleware: 'confirmed-auth',
	});

	const loginError = ref('');

	const client = useSupabaseClient();
	const router = useRouter();
	const user = useSupabaseUser();

	const disabled = ref(false);
	const resetBlock = ref(false);

	const credentials = reactive({
		email: '',
		password: '',
	});

	const toggleResetBlock = () => {
		console.log('working?');
		resetBlock.value = !resetBlock.value;
		if (resetBlock.value) {
			disabled.value = false;
		}
	};
	const handleOutsidePasswordModal = (event) => {
		if (resetBlock.value == true) {
			if (
				!event.target.closest('#password-modal') &&
				!event.target.closest('#login-footer')
			) {
				console.log('test');
				resetBlock.value = false;
			}
		}
	};

	async function signInWithEmail() {
		const { error: authError } = await client.auth.signInWithPassword({
			email: credentials.email,
			password: credentials.password,
		});

		if (authError) {
			loginError.value = 'Incorrect email or password. Please try again.';
			console.log(authError);
		} else {
			window.location.href = '/';
		}
	}

	const resetPassword = async () => {
		disabled.value = true;
		if (credentials.email) {
			try {
				const { error } = await client.auth.resetPasswordForEmail(
					credentials.email,
					{
						redirectTo: 'https://echo-waves.vercel.app/reset/update-password',
					},
				);

				if (error) {
					console.error(error);
					alert(error.message);
				} else {
					alert('Password reset instructions sent to your email.');
					router.push('/login');
				}
			} catch (error) {
				console.error(error);
				alert('An unexpected error occurred. Please try again.');
			}
		} else {
			alert('Please enter your email before resetting the password.');
		}
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
		position: relative;
		inner-column {
			display: flex;
			flex-direction: column;
			height: 100%;
		}
	}

	.submit-btn {
		&:disabled {
			background-color: var(--text-faded);
			opacity: 0.5;
			cursor: not-allowed;
		}
	}

	.error-message {
		color: var(--required-red);
		margin-top: 20px;
		font-weight: 600;
	}

	.sub-head {
		opacity: 0.75;
	}

	login-page {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 30px;
		position: relative;

		.sub-head {
			opacity: 0.75;
		}

		p.form-support {
			margin-bottom: 20px;
		}
	}

	.login-footer {
		.footer-action {
			appearance: none;
			border: none;
			outline: none;
			font-size: inherit;
			font-family: inherit;
			background-color: transparent;
			color: var(--button-bg);
			text-decoration: underline;
			border-radius: 3px;
			padding: 1px;
			cursor: pointer;

			transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;

			&:hover {
				background-color: var(--button-bg);
				color: var(--white);
			}
		}
	}

	password-modal {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 50%;
		min-height: 415px;
		background-color: var(--background);
		box-shadow: 0px 2px 2px rgb(var(--button-bg-rgb) / 0.2);
		transition: transform 0.3s ease-out;
		z-index: 1;
		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;

		form {
			padding-top: 30px;
		}
	}
	.close-btn {
		cursor: pointer;
		border-radius: 3px;
		font-weight: 700;
		border: none;
		padding: 4px;
		margin-left: auto;
		margin-bottom: 30px;
		appearance: none;
		background-color: var(--button-bg);
		transition: background-color 0.3s ease-in-out;
		&:hover {
			background-color: var(--button-bg-hover);
		}

		svg {
			stroke-width: 4px !important;
			color: var(--white);
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

	.move-enter-from,
	.move-leave-active {
		transition: all 0.4s;
		opacity: 0;
		transform: translate(0, -50%);
	}
</style>
