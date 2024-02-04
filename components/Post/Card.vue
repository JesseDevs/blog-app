<template>
	<router-link
		v-if="userProfile && user"
		:to="`${userProfile.username}/posts/${post.id}`"
	>
		<post-card>
			<picture>
				<img
					:src="`https://naduzuobtmmhavkozjxf.supabase.co/storage/v1/object/public/post-images/${userProfile.id}/${post.image_url}?t=2024-01-30T08%3A07%3A46.058Z`"
					alt=""
					@error="handleImageError"
				/>
				<div class="vignette-overlay"></div>
			</picture>

			<text-content>
				<h3 class="level-one-voice">{{ post.header }}</h3>
				<p class="visible-content">{{ post.content }}</p>
			</text-content>

			<card-details class="small-voice">
				<p class="faded">{{ formatTime(post.time_created) }}</p>
				<p>
					<Icon name="ph:dot-outline-fill" />
				</p>
				<p class="faded">{{ formattedDate(post.date_created) }}</p>
				<p>
					<Icon name="ph:dot-outline-fill" />
				</p>
				<p class="reading-time faded">{{ readingTime(post.content) }}</p>
			</card-details>
			<!-- <button @click="likePost(post.id)" :class="{ liked: isPostLiked(post.id) }">
				Like
			</button>

			<button @click="deletePost(post.id)">delete</button> -->
		</post-card>
	</router-link>
</template>

<script setup>
	// Change like and unlike buttons to separate things for ease. at the moment, postId is not removed from users likes

	import readingTime from '~/utils/readingTime';
	const props = defineProps({
		post: Object,
	});

	const client = useSupabaseClient();
	const user = useSupabaseUser();
	const userProfile = ref(null);
	const userPosts = ref([]);

	const fetchUserPosts = async () => {
		const { data, error } = await client
			.from('posts')
			.select('*')
			.eq('belongs_to', userProfile.id);

		if (error) {
			console.error('Error fetching user posts:', error.message);
		} else {
			userPosts.value = data || [];
		}
	};

	const deletePost = async (postId) => {
		const { data, error } = await client
			.from('posts')
			.delete()
			.eq('id', postId)
			.single();

		if (error) {
			console.error('Error deleting post:', error.message);
		} else {
			console.log('Post deleted successfully:', data);
			window.location.reload(true);
			fetchUserPosts();
		}
	};

	const handleImageError = (event) => {
		event.target.src = '/images/fallback-logo.jpg';
	};

	const formattedDate = (dateString) => {
		const options = { month: 'short', day: 'numeric', year: 'numeric' };
		const date = new Date(dateString);
		return date.toLocaleDateString(undefined, options);
	};

	const formatTime = (timeString) => {
		const time = new Date(`2000-01-01T${timeString}`);
		const hours = time.getHours();
		const minutes = time.getMinutes();
		const period = hours >= 12 ? 'pm' : 'am';
		const formattedHours = hours % 12 || 12;
		const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
		return `${formattedHours}:${formattedMinutes} ${period}`;
	};

	onMounted(async () => {
		if (user.value) {
			const { data, error } = await client
				.from('profiles')
				.select()
				.eq('id', user.value.id)
				.single();

			if (error) {
				console.error('Error fetching user profile:', error.message);
			} else {
				userProfile.value = data;
			}
		}

		fetchUserPosts();
	});

	const isPostLiked = (postId) => {
		return userProfile.value && userProfile.value.likes.includes(postId);
	};

	// const likePost = async (postId) => {
	// 	const currentUsername = userProfile.value.username;
	// 	const currentUserId = userProfile.value.id;

	// 	const { data: post, error: postError } = await client
	// 		.from('posts')
	// 		.select('*')
	// 		.eq('id', postId)
	// 		.single();

	// 	if (postError) {
	// 		console.error('Error fetching post:', postError);
	// 		return;
	// 	}

	// 	const likesArray = post.likes || [];
	// 	const userIndex = likesArray.indexOf(currentUsername);

	// 	if (userIndex !== -1) {
	// 		likesArray.splice(userIndex, 1);
	// 	} else {
	// 		likesArray.push(currentUsername);
	// 	}

	// 	const { data: postData, error: updateError } = await client
	// 		.from('posts')
	// 		.update({ likes: likesArray })
	// 		.eq('id', postId);

	// 	if (updateError) {
	// 		console.error('Error updating post likes:', updateError);
	// 	} else {
	// 		console.log('Post likes updated successfully:', postData);
	// 	}

	// 	// FOR THE USERS LIKES

	// 	const likedPostIdsArray = userProfile.likes || [];
	// 	const isPostIdInArray = likedPostIdsArray.includes(String(postId));
	// 	const updatedArray = likedPostIdsArray.filter((id) => id !== String(postId));

	// 	if (!isPostIdInArray) {
	// 		updatedArray.push(String(postId));
	// 		console.log('Added postId:', postId);
	// 	} else {
	// 		console.log('postId already in the array');
	// 	}

	// 	const { data: updatedProfileData, error: profileUpdateError } = await client
	// 		.from('profiles')
	// 		.update({ likes: updatedArray })
	// 		.eq('id', currentUserId);

	// 	if (profileUpdateError) {
	// 		console.error(
	// 			'Error updating liked post IDs in profile:',
	// 			profileUpdateError,
	// 		);
	// 	} else {
	// 		console.log('Liked post IDs updated in profile successfully:');
	// 	}
	// };
</script>

<style lang="scss" scoped>
	.liked {
		background-color: red;
	}
	post-card.no-image {
		grid-template-columns: 1fr;
	}

	post-card {
		display: grid;
		grid-template-columns: 125px 1fr;
		column-gap: 10px;
		row-gap: 10px;
		width: 100%;
		position: relative;

		h3 {
			font-weight: 700;
			text-transform: uppercase;
		}

		picture {
			position: relative;
			max-height: 125px;
			border-radius: 5px;
			img {
				width: 125px;
				height: 125px;
				object-fit: cover;
				border-radius: 5px;
			}

			.vignette-overlay {
				border-radius: 5px;
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: rgb(255, 255, 255);
				background: radial-gradient(
					circle,
					rgba(255, 255, 255, 0) 0%,
					rgba(0, 0, 0, 0.6) 90%
				);
				pointer-events: none;
			}
		}

		text-content {
			overflow: hidden;
			position: relative;
			font-style: italic;
			grid-column: 2/-1;
			gap: 10px;
			p.visible-content {
				max-height: 6em;
				min-height: 4em;
			}

			.blurred {
				background: rgba(0, 0, 0, 0.05);
				box-shadow: 0 0px 0px 0 rgba(10, 18, 132, 0.5);
				backdrop-filter: blur(2px);

				position: absolute;
				bottom: 0;
				left: 0;
				height: 50%;
				width: 100%;
				z-index: 100;
			}
		}
	}

	card-details {
		grid-column: 1/-1;
		display: flex;
		align-self: flex-end;
		width: 100%;
		justify-content: flex-start;
		gap: 2px;
		padding-top: 2px;

		p {
			font-size: inherit;
		}

		.reading-time {
			text-transform: uppercase;
		}

		.faded {
			color: var(--faded-text);
		}
	}
</style>
