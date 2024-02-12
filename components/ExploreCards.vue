<template>
	<ul v-if="posts" class="card-menu">
		<li v-for="post in posts" :key="post.id">
			<NuxtLink :to="`${getUserByUsername(post.belongs_to)}/posts/${post.id}`">
				<PostHomeCard :post="post" />
			</NuxtLink>
		</li>
	</ul>
</template>

<script setup>
	const posts = ref([]);
	const client = useSupabaseClient();
	const user = useSupabaseUser();
	const route = useRoute();

	const fetchUsernameById = async (userId) => {
		try {
			const { data, error } = await client
				.from('profiles')
				.select('username')
				.eq('id', userId)
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
				.order('created_at', { ascending: false });

			if (error) {
				console.error('Error fetching posts:', error.message);
			} else {
				posts.value = data;
			}
		} catch (error) {
			console.error('Error fetching posts:', error.message);
		}
	};

	const getUserByUsername = async (userId) => {
		try {
			const username = await fetchUsernameById(userId);
			return username;
		} catch (error) {
			console.error('Error fetching username:', error.message);
			return '';
		}
	};

	onMounted(async () => {
		await fetchPosts();
	});
</script>

<style lang="scss"></style>
