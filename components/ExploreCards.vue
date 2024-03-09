<template>
	<div>
		<ul v-if="posts" class="card-menu" id="explore-cards">
			<li v-for="post in posts" :key="post.id">
				<PostHomeCard :post="post" />
			</li>
		</ul>
		<button @click="loadMorePosts">Load More</button>
	</div>
</template>

<script setup>
	const posts = ref([]);
	const client = useSupabaseClient();
	const user = useSupabaseUser();
	const route = useRoute();
	const username = ref('');

	const pageSize = 10; // Number of posts to load per page
	let currentPage = ref(1); // Current page of loaded posts
	let hasMorePosts = ref(true);

	const fetchUsernameById = async (id) => {
		try {
			const { data, error } = await client
				.from('profiles')
				.select('username')
				.eq('id', id)
				.single();

			if (error) {
				throw error;
			}

			if (data) {
				return data.username;
			}

			return '';
		} catch (error) {
			console.error('Error fetching username:', error.message);
			return '';
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
					hasMorePosts.value = false; // No more posts to load
				}
				posts.value.push(...data);
				currentPage.value++;
			}
		} catch (error) {
			console.error('Error fetching posts:', error.message);
		}
	};

	const loadMorePosts = async () => {
		await fetchPosts();
		for (const post of posts.value) {
			const user = await getUserByUsername(post.belongs_to);
			post.username = user; // Add username property to each post
		}
	};

	const getUserByUsername = async (id) => {
		try {
			const username = await fetchUsernameById(id);
			return username;
		} catch (error) {
			console.error('Error fetching username:', error.message);
			return '';
		}
	};

	onMounted(async () => {
		await fetchPosts();
		for (const post of posts.value) {
			const user = await getUserByUsername(post.belongs_to);
			post.username = user;
		}
	});
</script>

<style lang="scss" scoped>
	ul {
		scroll-margin-top: 45px;
	}
</style>
