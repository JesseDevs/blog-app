<template>
	<div>
		detail
		{{ props.post }}
	</div>
</template>

<script setup>
	const props = defineProps({
		post: Object,
	});

	console.log(props);

	// const post = ref(null);

	// onMounted(async () => {
	// 	// Fetch the post data based on the route parameter (id)
	// 	const postId = $route.params.id;
	// 	// Replace the following with your actual data fetching logic
	// 	post.value = await fetchPostData(postId);
	// });

	// async function fetchPostData(postId) {
	// 	// Implement your logic to fetch post data from your API or wherever it's stored
	// 	// For example, you can use your Supabase client to fetch data
	// 	// const { data, error } = await client.from('posts').select().eq('id', postId).single();
	// 	// return data;
	// 	return { id: postId, title: 'Fetched Post', content: 'Fetched Content' };
	// }
</script>

<style lang="scss" scoped></style>
