<template>
	<div>
		<form @submit.prevent="addPost">
			<label for="postHeading">Post Heading:</label>
			<input v-model="postHeading" type="text" id="postHeading" required />

			<label for="postContent">Post Content:</label>
			<textarea v-model="postContent" id="postContent" required></textarea>

			<button type="submit">Add Post</button>
		</form>
	</div>
</template>

<script setup>
	import { v4 as uuidv4 } from 'uuid';
	const postHeading = ref('');
	const postContent = ref('');

	const client = useSupabaseClient();

	async function addPost() {
		const postId = uuidv4();
		// Validate post data
		if (!postHeading.value || !postContent.value) {
			alert('Please provide both heading and content for the post.');
			return;
		}

		// Assuming the user is already registered and you have their profile ID
		const userId = '2eded9f4-c040-4a01-a7db-43ddbce823e5'; // Replace with the actual user profile ID

		// Assuming 'posts' is the table storing user posts
		const { error } = await client.from('posts').insert([
			{
				id: postId,
				profile_id: userId,
				heading: postHeading.value,
				content: postContent.value,
				// You can add other properties like 'image' here when needed
			},
		]);

		if (error) {
			console.error('Error adding post:', error);
			return;
		}

		alert('Post added successfully!');
		// Clear the form fields after adding the post
		postHeading.value = '';
		postContent.value = '';
	}
</script>
