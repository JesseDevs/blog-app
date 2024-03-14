<template>
	<section>
		<inner-column>
			<reset-page>
				<div>
					<h2 class="level-three-voice">Reset Password</h2>
					<p class="sub-head">
						Forgot your password? <br />
						Let's figure that out.
					</p>
				</div>
				<form @submit.prevent="resetPassword">
					<div class="field">
						<label for="email">Email</label>
						<input id="email" disabled v-model="email" />
					</div>

					<div class="field">
						<label for="newPassword">New Password</label>
						<input id="newPassword" v-model="newPassword" />
					</div>

					<div class="field">
						<label for="newPassword">Confirm New Password</label>
						<input id="confirmNewPassword" v-model="confirmNewPassword" />
					</div>

					<button type="submit" class="button-filled submit-btn">Save</button>
				</form>
			</reset-page>
		</inner-column>
	</section>
</template>

<script setup>
	const client = useSupabaseClient();
	const user = useSupabaseUser();
	const route = useRoute();
	const router = useRouter();
	const currentUser = ref(null);

	const newPassword = ref('');
	const confirmNewPassword = ref('');
	const email = ref('');

	const fetchCurrentUser = async () => {
		try {
			if (user.value) {
				const { data, error } = await client
					.from('profiles')
					.select('*')
					.eq('id', user.value.id)
					.single();

				if (error) {
					console.error('Error fetching user profile:', error.message);
				} else {
					currentUser.value = data;
					email.value = currentUser.value.email;
				}
			}
		} catch (error) {
			console.error('Error fetching user profile:', error.message);
		}
	};

	const resetPassword = async () => {
		const code = route.query.code;
		if (!code) {
			console.error('No reset code found');
			return;
		}

		if (newPassword.value == confirmNewPassword.value) {
			try {
				const { data, error } = await client.auth.updateUser({
					password: newPassword.value,
				});
				if (!error) {
					router.push('/');
				}
			} catch (error) {
				console.error('Password reset error:', error.message);
			}
		}
	};

	onMounted(async () => {
		await fetchCurrentUser();
	});
</script>

<style lang="scss" scoped>
	reset-page {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 30px;

		.sub-head {
			opacity: 0.75;
		}
	}
</style>
