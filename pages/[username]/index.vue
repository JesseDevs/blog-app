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
					<div
						@click="selectedTab = 'posts'"
						:class="{ active: selectedTab === 'posts' }"
					>
						<p>Posts</p>
						<span></span>
					</div>
					<div
						@click="selectedTab = 'likes'"
						:class="{ active: selectedTab === 'likes' }"
					>
						<p>Likes</p>
						<span></span>
					</div>
				</nav>
			</dashboard-menu>
		</profile-dashboard>

		<div v-if="userProfile && isDataLoaded">
			<ul v-show="selectedTab === 'posts'" class="card-menu">
				<li v-for="post in posts" :key="post.id">
					<PostCard :post="post" :userProfile="userProfile" />
				</li>
			</ul>

			<ul v-show="selectedTab === 'likes'" class="card-menu">
				<li v-for="like in likedPosts" :key="like.id">
					<PostHomeCard :post="like" :userProfile="userProfile" />
				</li>
			</ul>
			<p
				class="level-one-voice no-likes"
				v-if="selectedTab === 'likes' && likedPosts.length === 0"
			>
				No liked posts found.
			</p>
		</div>

		<PostNoUser v-if="isDataLoaded && !userProfile" :user="user" />
	</section>
</template>
<script setup>
	const posts = ref([]);
	const likedPosts = ref([]);
	const client = useSupabaseClient();
	const user = useSupabaseUser();
	const route = useRoute();

	const isDataLoaded = ref(false);

	const userProfile = ref(null);
	const currentUser = ref(null);
	const formattedDate = ref('');
	const selectedTab = ref('');

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

	const fetchLikes = async () => {
		try {
			const { data: likesData, error: likesError } = await client
				.from('likes')
				.select('*')
				.eq('user_id', userProfile.value.id);

			const postIds = likesData.map((like) => like.post_id);

			if (postIds.length === 0) {
				likedPosts.value = [];
				return;
			}

			const { data: actualLikedPosts, error: postsError } = await client
				.from('posts')
				.select('*')
				.in('id', postIds);

			if (postsError) {
				throw new Error('Error fetching liked posts:', postsError.message);
			}

			likedPosts.value = actualLikedPosts;
		} catch (error) {
			console.error('Error fetching likes:', error.message);
		}
	};

	onMounted(async () => {
		selectedTab.value = 'posts';
		await fetchCurrentUser();
		await fetchUserProfile();
		await fetchPosts();
		await fetchLikes();
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
			position: relative;
			display: flex;
			cursor: pointer;
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
			}
		}

		nav div.active span {
			position: absolute;
			border-radius: 999px;
			background-color: var(--button-bg);
			bottom: -1.5px;
			left: 50%;
			transform: translateX(-50%);
			width: 60%;
			height: 4px;
			transition: width 0.5s ease-in-out, transform 0.3s ease-in-out;
			animation: reverse-moving-span 0.5s;
		}
		nav div:last-child.active span {
			animation: moving-span 0.5s;
		}
	}

	@keyframes moving-span {
		0% {
			left: 0;
			transform: translateX(-50%);
			width: 0;
		}
		50% {
			left: 70%;
			width: 80%;
		}
		100% {
			left: 50%;
			width: 60%;
		}
	}

	@keyframes reverse-moving-span {
		0% {
			left: 50%;
			width: 60%;
			transform: translateX(-50%);
		}
		50% {
			left: 0;
			width: 80%;
		}
		100% {
			left: 50%;
			width: 60%;
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

	.no-likes {
		text-align: center;
		padding-top: 3rem;
	}
</style>
