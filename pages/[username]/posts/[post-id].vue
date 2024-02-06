<template>
	<detail-page>
		detail
		<h1>{{ post.header }}</h1>
		<p>{{ post.content }}</p>
	</detail-page>
</template>

<script setup>
	const client = useSupabaseClient();
	const user = useSupabaseUser();
	const userProfile = ref(null);
	const route = useRoute();
	const post = ref({});

	onMounted(async () => {
		const postId = route.params.postid;
		try {
			const { data, error } = await client
				.from('posts')
				.select('*')
				.eq('id', postId)
				.single();
			if (error) {
				throw error;
			}
			post.value = data;
		} catch (error) {
			console.error(error);
		}
	});
</script>

<style lang="scss" scoped>
	detail-page {
		display: flex;
		flex-direction: column;
		width: 100%;
		position: relative;
	}
</style>
