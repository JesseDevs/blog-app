<template>
	<NuxtLink v-if="userProfile" :to="`${userProfile.username}/posts/${post.id}`">
		<post-card>
			<picture>
				<img
					v-if="!imageLoaded"
					:src="fallbackImageUrl"
					alt="Fallback Image"
					loading="eager"
				/>
				<img
					:src="`https://naduzuobtmmhavkozjxf.supabase.co/storage/v1/object/public/post-images/${userProfile.id}/${post.image_url}?t=2024-01-30T08%3A07%3A46.058Z`"
					alt=""
					@error="handleImageError"
					@load="imageLoaded = true"
					loading="lazy"
				/>
				<div class="vignette-overlay"></div>
			</picture>

			<text-content>
				<h3 class="level-one-voice">{{ post.header }}</h3>
				<p class="visible-content">{{ truncatedText }}</p>
			</text-content>

			<!-- <button @click="likePost(post.id)" :class="{ liked: isPostLiked(post.id) }">
				Like
			</button>

			<button @click="deletePost(post.id)">delete</button> -->
		</post-card>
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
	</NuxtLink>
</template>

<script setup>
	import readingTime from '~/utils/readingTime';
	const props = defineProps({
		post: Object,
		userProfile: Object,
	});

	const client = useSupabaseClient();
	const user = useSupabaseUser();
	const userPosts = ref([]);
	const imageLoaded = ref(false);
	const fallbackImageUrl = '/images/fallback-logo.jpg';

	const truncatedHeader = computed(() => {
		if (!props.post || !props.post.header) return '';
		const text = props.post.content.trim();
		const charLimit = 35;
		if (text.length > charLimit) {
			return text.slice(0, charLimit) + '...';
		} else {
			return text;
		}
	});

	const truncatedText = computed(() => {
		if (!props.post || !props.post.content) return '';
		const words = props.post.content.trim().split(' ');
		const wordsLimit = 10;
		const truncated = words.slice(0, wordsLimit).join(' ');
		if (words.length > wordsLimit) {
			return truncated + '...';
		} else {
			return truncated;
		}
	});

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
</script>

<style lang="scss">
	.liked {
		background-color: red;
	}
</style>
