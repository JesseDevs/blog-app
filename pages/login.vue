<template>
	<section class="register">
		<inner-column>
			<login-page>
				<div>
					<h2 class="level-three-voice">Log In</h2>
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
							autocomplete="off"
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
								color="rgb(128, 127, 127)"
								size="28"
							/>
						</button>
					</div>
					<button class="button-filled" type="submit">Submit</button>
				</form>

				<p class="form-support small-voice">
					Don't have an account?
					<a class="custom-link" href="/register">Sign Up</a>
				</p>
				<!-- <p class="form-support small-voice">
					<button
						class="button-outline"
						type="button"
						@click.prevent="resetPassword"
					>
						Reset Password
					</button>
				</p> -->
			</login-page>
		</inner-column>
	</section>
</template>

<script setup>
	const client = useSupabaseClient();
	const router = useRouter();
	const user = useSupabaseUser();

	const credentials = reactive({
		email: '',
		password: '',
	});

	async function signInWithEmail() {
		const { error } = await client.auth.signInWithPassword({
			email: credentials.email,
			password: credentials.password,
		});

		if (error) {
			console.log(error);
			alert(error);
		}

		if (!error) {
			window.location.href = '/';
		} else {
			console.error(error);
		}
	}

	const resetPassword = async () => {
		if (credentials.email) {
			try {
				const { error } = await client.auth.resetPasswordForEmail(
					credentials.email,
				);

				if (error) {
					console.error(error);
					alert('Password reset failed. Please try again.');
				} else {
					alert('Password reset instructions sent to your email.');
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
	}

	login-page {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 2rem;

		.sub-head {
			opacity: 0.75;
		}

		p.form-support {
			margin-bottom: 30px;

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

	.success {
		color: green;
	}

	.error {
		color: red;
	}
</style>
