<template>
	<section class="register">
		<inner-column>
			<signup-page>
				<div>
					<h2 class="level-three-voice">Log In</h2>
					<p class="sub-head">
						Enter your email and password to access your dashboard.
					</p>
				</div>
				<form @submit.prevent="signInWithEmail()">
					<div class="field">
						<label for="email">Email<span>*</span></label>
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
						<label for="password">Password<span>*</span></label>
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
					<button class="button-filled" type="submit">Submit</button>
				</form>

				<div>
					<p form-support small-voice>
						Don't have an account? <a href="/register">Sign Up</a>
					</p>
				</div>
			</signup-page>
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

	// Need to add a redirect

	async function signInWithEmail() {
		const { data, error } = await client.auth.signInWithPassword({
			email: credentials.email,
			password: credentials.password,

		});
	}

	const showPassword = ref(false);
	const togglePassword = () => {
		if (credentials.password) {
			showPassword.value = !showPassword.value;
		}
	};
</script>

<style lang="scss" scoped>
	section {
		height: 100vh;
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

	.success {
		color: green;
	}

	.error {
		color: red;
	}
</style>
