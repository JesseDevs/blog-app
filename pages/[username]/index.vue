<template>
	<section>
		<profile-dashboard v-if="userProfile">
			<inner-container>
				<NuxtLink
					v-if="currentUser?.id === userProfile.id"
					:to="`${userProfile.username}/edit/profile`"
					aria-label="edit profile"
					class="outline-button"
					>Edit Profile</NuxtLink
				>
				<h2 class="level-two-voice full-name">
					{{ userProfile.full_name }}
				</h2>
				<p class="username">@{{ userProfile.username }}</p>
				<details-box>
					<p v-if="userProfile.bio">
						{{ userProfile.bio }}
					</p>
					<p>
						<Icon name="clarity:calendar-line" /> Joined
						{{ formattedDate }}
					</p>
				</details-box>
			</inner-container>

			<dashboard-menu>
				<nav>
					<div>
						<p>Posts</p>
						<span></span>
					</div>
				</nav>
			</dashboard-menu>
		</profile-dashboard>

		<ul v-if="userProfile && isDataLoaded" class="card-menu">
			<li v-for="post in posts" :key="post.id">
				<PostCard :post="post" :userProfile="userProfile" />
			</li>
		</ul>

		<PostNoUser v-if="isDataLoaded && !userProfile" :user="user" />
	</section>
</template>
<script setup>
	const posts = ref([]);
	const client = useSupabaseClient();
	const user = useSupabaseUser();
	const route = useRoute();

	const isDataLoaded = ref(false);

	const userProfile = ref(null);
	const currentUser = ref(null);
	const formattedDate = ref('');

	const formatDate = () => {
		const userValue = user?.value;
		if (userValue && userValue.identities && userValue.identities.length > 0) {
			const created_at_timestamp = userValue.identities[0].created_at;
			const created_at_datetime = new Date(created_at_timestamp);
			const options = { year: 'numeric', month: 'long' };
			formattedDate.value = created_at_datetime.toLocaleDateString(
				'en-US',
				options,
			);
		} else {
			console.error(
				'No identity found or missing created_at property in identities array.',
			);
		}
	};
	formatDate();

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
				}
			}
		} catch (error) {
			console.error('Error fetching user profile:', error.message);
		}
	};

	const fetchUserProfile = async () => {
		try {
			const { data, error } = await client
				.from('profiles')
				.select('*')
				.eq('username', route.params.username)
				.single();

			if (error) {
				console.error('Error fetching user profile:', error.message);
			} else {
				userProfile.value = data;
			}
		} catch (error) {
			console.error('Error fetching user profile:', error.message);
		}
	};

	const fetchPosts = async () => {
		try {
			if (userProfile.value) {
				const { data, error } = await client
					.from('posts')
					.select('*')
					.eq('belongs_to', userProfile.value.id)
					.order('created_at', { ascending: false });

				if (error) {
					console.error('Error fetching posts:', error.message);
				} else {
					posts.value = data;
				}
			}
		} catch (error) {
			console.error('Error fetching posts:', error.message);
		}
	};

	onMounted(async () => {
		await fetchCurrentUser();
		await fetchUserProfile();
		await fetchPosts();
		isDataLoaded.value = true;
	});
</script>

<style lang="scss" scoped>
	section {
		min-height: 100vh;

		.loading-container {
			display: grid;
			place-items: center;
			min-height: 40vh;
			margin-bottom: 40vh;
		}
	}

	details-box {
		display: flex;
		flex-direction: column;
		width: 100%;
		color: var(--text-faded);
		padding-top: 10px;
		max-width: 250px;

		p {
			display: flex;
			align-items: center;
			gap: 5px;
		}
	}

	.content-container {
		overflow: hidden;
		position: relative;
	}

	dashboard-menu {
		display: block;
		width: 100%;
		margin-top: 2rem;

		nav {
			display: flex;
			border-bottom: var(--thin) solid var(--text-faded);

			div {
				padding: 0px 1.5rem;
				position: relative;
				transition: background-color 0.2s ease-in-out;

				&:hover {
					background-color: var(--dash-hover);
				}

				p {
					display: inline-block;
					padding: 16px 0px;
				}

				span {
					position: absolute;
					height: 4px;
					border-radius: 999px;
					background-color: var(--button-bg);

					bottom: -1.5px;
					left: 50%;
					transform: translateX(-50%);
					width: 85%;
				}
			}
		}
	}

	inner-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: flex-start;
		padding: 4rem 1.5rem;
		padding-bottom: 0;
	}

	profile-dashboard {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: flex-start;

		.outline-button {
			align-self: flex-end;
			margin-bottom: 1rem;

			&:hover {
				background-color: var(--dash-hover);
			}
		}

		.full-name {
			// font-family: 'Roboto Slab', serif;
			font-weight: 600;
		}

		.username {
			color: var(--text-faded);
			// font-family: 'Roboto Slab', serif;
		}
	}
</style>
