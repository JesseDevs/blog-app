<template>
	<section>
		<inner-column>
			<edit-page>
				<div>
					<h2 class="level-three-voice">Edit Your Profile</h2>
					<p class="sub-head">
						This is an opportunity to change you name or add some more detail
						to your account.
					</p>
				</div>
				<form @submit.prevent="updateProfile">
					<div class="field">
						<label for="bio">Username</label>
						<input id="bio" disabled v-model="username" />
					</div>
					<div class="field">
						<label for="bio">Full Name</label>
						<input id="bio" v-model="fullName" />
					</div>
					<div class="field">
						<label for="bio">Bio</label>
						<textarea
							id="bio"
							class="bio-text"
							v-model="bio"
							maxlength="150"
						/>
					</div>
					<button type="submit" class="button-filled submit-btn">Save</button>
				</form>
			</edit-page>
		</inner-column>
	</section>
</template>

<script setup>
	definePageMeta({
		middleware: 'auth',
	});

	const client = useSupabaseClient();
	const user = useSupabaseUser();
	const route = useRoute();
	const router = useRouter();
	const currentUser = ref(null);

	const username = ref('');
	const fullName = ref('');
	const bio = ref('');

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
					fullName.value = currentUser.value.full_name;
					username.value = currentUser.value.username;

					bio.value = currentUser.value.bio || '';
				}
			}
		} catch (error) {
			console.error('Error fetching user profile:', error.message);
		}
	};

	const updateProfile = async () => {
		try {
			if (!user.value || !user.value.id) {
				console.error('User or user ID is undefined.');
				return;
			}

			const { error } = await client
				.from('profiles')
				.update({ full_name: fullName.value, bio: bio.value })
				.eq('id', user.value.id);

			if (error) {
				console.error('Error updating user profile:', error.message);
				return;
			}

			router.push(`/${currentUser.value.username}`);
		} catch (error) {
			console.error('Error updating user profile:', error.message);
		}
	};

	onMounted(async () => {
		await fetchCurrentUser();
	});
</script>

<style lang="scss" scoped>
	edit-page {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 30px;

		.sub-head {
			opacity: 0.75;
		}
	}
</style>
