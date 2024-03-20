<template>
	<div v-if="posts" class="explore-cards-container">
		<ul class="card-menu" id="explore-cards">
			<li v-if="pinnedPost && pinnedPost.id" :key="pinnedPost.id">
				<template v-if="pinnedPost.userProfile">
					<PostHomeCard
						:post="pinnedPost"
						:userProfile="pinnedPost.userProfile"
						:isPinnedInExploreCards="true"
					/>
				</template>
			</li>

			<li v-for="post in sortedPosts" :key="post.id">
				<template v-if="post.userProfile && post !== pinnedPost">
					<PostHomeCard
						:post="post"
						:userProfile="post.userProfile"
						:isPinnedInExploreCards="true"
					/>
				</template>
			</li>
		</ul>
		<div class="load-more-container">
			<button
				v-show="hasMorePosts"
				class="load-more-btn user-button"
				@click="loadMorePosts"
				:disabled="!hasMorePosts"
			>
				Load More
			</button>
		</div>
	</div>
</template>

<script setup>
	const posts = ref([]);
	const pinnedPosts = ref([]);
	const client = useSupabaseClient();
	const user = useSupabaseUser();
	const route = useRoute();

	const sortedPosts = computed(() => {
		return [...posts.value.filter((post) => !post.pinned)];
	});

	const pinnedPost = ref(null);

	if (posts.value.length === 9) {
		emit('empty-posts');
	}

	const pageSize = 10; // Number of posts to load per page
	let currentPage = ref(1);
	let hasMorePosts = ref(true);

	const fetchPinnedPost = async () => {
		try {
			const { data, error } = await client
				.from('posts')
				.select('*')
				.eq('pinned', true)
				.single();

			if (error) {
				console.error('Error fetching pinned post:', error.message);
				return;
			}

			pinnedPost.value = data;
			if (pinnedPost.value) {
				const userProfile = await fetchUserProfileById(
					pinnedPost.value.belongs_to,
				);
				pinnedPost.value.userProfile = userProfile;
			}
		} catch (error) {
			console.error('Error fetching pinned post:', error.message);
		}
	};

	const fetchPosts = async () => {
		try {
			const { data, error } = await client
				.from('posts')
				.select('*')
				.order('created_at', { ascending: false })
				.range(
					(currentPage.value - 1) * pageSize,
					currentPage.value * pageSize - 1,
				);

			if (error) {
				console.error('Error fetching posts:', error.message);
			} else {
				if (data.length < pageSize) {
					hasMorePosts.value = false;
				}
				posts.value.push(...data);
				currentPage.value++;
			}
		} catch (error) {
			console.error('Error fetching posts:', error.message);
		}
	};

	const fetchUserProfileById = async (id) => {
		try {
			const { data, error } = await client
				.from('profiles')
				.select('*')
				.eq('id', id)
				.single();

			if (error) {
				throw error;
			}

			if (data) {
				return data;
			}

			return null;
		} catch (error) {
			console.error('Error fetching user profile:', error.message);
			return null;
		}
	};

	const loadMorePosts = async () => {
		await fetchPosts();
		await Promise.all(
			posts.value.map(async (post) => {
				const userProfile = await fetchUserProfileById(post.belongs_to);
				post.userProfile = userProfile;
			}),
		);
	};

	const getUserByUsername = async (id) => {
		try {
			const userProfile = await fetchUserProfileById(id);
			return userProfile;
		} catch (error) {
			console.error('Error fetching user profile:', error.message);
			return null;
		}
	};

	onMounted(async () => {
		await fetchPosts();
		await fetchPinnedPost();
		if (posts.value.length > 0) {
			await Promise.all(
				posts.value.map(async (post) => {
					const userProfile = await getUserByUsername(post.belongs_to);
					post.userProfile = userProfile;
				}),
			);
		}
	});
</script>

<style lang="scss" scoped>
	.explore-cards-container {
		scroll-margin-top: 45px;
	}
	ul {
		scroll-margin-top: 45px;

		li:first-of-type a {
			post-card {
				border-top: var(--thin) solid var(--text-faded);
			}
		}
	}

	.load-more-container {
		padding-top: 50px;
		padding-bottom: 100px;
	}

	.load-more-btn {
		outline: none;
		border: none;
		margin: 0 auto;

		padding-left: 40px;
		padding-right: 40px;

		&:disabled {
			background-color: var(--text-faded);
			opacity: 0.5;
			cursor: not-allowed;
		}
	}
</style>
