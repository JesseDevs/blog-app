<template>
	<section>
		<div v-if="userProfile">
			<profile-dashboard>
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
						<p class="support-text" v-if="userProfile.bio">
							{{ userProfile.bio }}
						</p>
						<p class="joined-date">
							<Icon name="clarity:calendar-line" /> Joined
							{{ formatCreatedAt(userProfile.created_at) }}
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
						<span
							class="active-tab-support"
							:style="{ left: tabPosition }"
						></span>
					</nav>
				</dashboard-menu>
			</profile-dashboard>
			<Transition mode="out-in" name="card-swap">
				<div v-show="userProfile && isDataLoaded">
					<ul v-show="selectedTab === 'posts'" class="card-menu">
						<li v-for="post in posts" :key="post.id">
							<PostCard
								:post="post"
								:userProfile="userProfile"
								@load="setCardLoaded('post', post.id)"
								v-show="isCardLoaded('post', post.id)"
							/>
						</li>
					</ul>
					<p
						class="level-one-voice no-likes"
						v-if="selectedTab === 'posts' && posts.length === 0"
					>
						No posts found.
					</p>
					<ul v-show="selectedTab === 'likes'" class="card-menu">
						<li v-for="like in likedPosts" :key="like.id">
							<PostHomeCard :post="like" :userProfile="like.userProfile" />
						</li>
					</ul>
					<p
						class="level-one-voice no-likes"
						v-if="selectedTab === 'likes' && likedPosts.length === 0"
					>
						No liked posts found.
					</p>
				</div>
			</Transition>
			<div v-if="!isDataLoaded" class="spinner-container">
				<div class="spinner">
					<Icon name="svg-spinners:pulse-2" size="100" />
				</div>
				<div class="spinner-2">
					<Icon
						name="svg-spinners:pulse-2"
						size="40"
						color="var(--button-bg)"
					/>
				</div>
			</div>
		</div>
		<PostNoUser v-if="isDataLoaded && !userProfile" :user="user" />
	</section>
</template>
<script setup>
	import { formattedDate, formatTime } from '~/utils/dateUtils';
	const posts = ref([]);
	const likedPosts = ref([]);
	const client = useSupabaseClient();
	const user = useSupabaseUser();
	const route = useRoute();

	const userProfile = ref(null);
	const currentUser = ref(null);
	const selectedTab = ref('posts');
	const tabPosition = ref('0px');

	const isDataLoaded = ref(false);
	const loadedCards = ref({});

	const setCardLoaded = (type, id) => {
		loadedCards.value[`${type}_${id}`] = true;
	};

	const isCardLoaded = (type, id) => {
		return loadedCards.value[`${type}_${id}`];
	};

	watchEffect(() => {
		if (selectedTab.value === 'posts') {
			tabPosition.value = '0px';
		} else if (selectedTab.value === 'likes') {
			tabPosition.value = '50%';
		}
	});

	function formatCreatedAt(created_at) {
		const date = new Date(created_at);
		const options = { month: 'long', year: 'numeric' };
		return `Joined ${date.toLocaleDateString('en-US', options)}`;
	}

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
				.ilike('username', route.params.username)
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
				.in('id', postIds)
				.order('created_at', { ascending: false });

			if (postsError) {
				throw new Error('Error fetching liked posts:', postsError.message);
			}

			const profiles = await Promise.all(
				actualLikedPosts.map(async (post) => {
					const { data: profile, error: profileError } = await client
						.from('profiles')
						.select('*')
						.eq('id', post.belongs_to)
						.single();
					if (profileError) {
						throw new Error(
							'Error fetching user profile:',
							profileError.message,
						);
					}
					return profile;
				}),
			);

			const likedPostsWithProfiles = actualLikedPosts.map((post, index) => ({
				...post,
				userProfile: profiles[index],
			}));

			likedPosts.value = likedPostsWithProfiles;
		} catch (error) {
			console.error('Error fetching likes:', error.message);
		}
	};

	onMounted(async () => {
		await fetchCurrentUser();
		await fetchUserProfile();
		await fetchPosts();
		await fetchLikes();

		watch(userProfile, (newValue) => {
			useHead({
				title: newValue ? `${newValue.username} @ ECHO` : 'ECHO',
			});
		});

		setTimeout(() => {
			isDataLoaded.value = true;
		}, 600);
	});
</script>

<style lang="scss" scoped>
	.card-swap-enter-active,
	.card-swap-leave-active {
		transition: opacity 0.5s ease;
	}

	.card-swap-enter-from,
	.card-swap-leave-to {
		opacity: 0;
	}

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
		gap: 3px;
		width: 100%;

		padding-top: 10px;
		max-width: 250px;

		p {
			display: flex;
			align-items: center;
			gap: 5px;
		}
		p.support-text {
			color: rgb(var(--white-rgb) / 0.85);
		}
	}

	.content-container {
		overflow: hidden;
		position: relative;
	}

	dashboard-menu {
		display: block;
		width: 100%;
		border-bottom: var(--thin) solid var(--text-faded);
		margin-top: 2rem;

		nav {
			max-width: fit-content;
			position: relative;
			display: flex;
			cursor: pointer;

			div {
				padding: 0px 1.5rem;
				position: relative;
				transition: background-color 0.2s ease-in-out;

				p {
					display: inline-block;
					padding: 16px 0px;
				}
			}

			span.active-tab-support {
				position: absolute;
				bottom: 0;
				left: 0;
				width: 50%;
				height: 100%;
				background-color: rgba(79, 79, 79, 0.11);
				z-index: 0;
				transition: transform 0.3s, width 0.3s, left 0.3s;

				&:after {
					content: '';
					position: absolute;
					border-radius: 999px;
					background-color: var(--button-bg);
					bottom: 0;
					left: 50%;
					transform: translate(-50%, 50%);
					width: 60%;
					height: 4px;
					transition: transform 0.3s, width 0.3s, left 0.3s;
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

		.username,
		.joined-date {
			color: var(--text-faded);
			// font-family: 'Roboto Slab', serif;
		}
	}

	.no-likes {
		text-align: center;
		padding-top: 3rem;
	}

	.spinner-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px 20px;

		.spinner-2 {
			position: absolute;
		}
	}
</style>
