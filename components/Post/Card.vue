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
	post-card.no-image {
		grid-template-columns: 1fr;
	}

	post-card {
		padding-top: 20px;
		padding-bottom: 20px;
		display: grid;
		grid-template-columns: 50px 1fr;
		column-gap: 8px;
		row-gap: 10px;
		width: 100%;
		position: relative;

		h3 {
			font-weight: 700;
			text-transform: uppercase;
			word-break: break-word;
		}

		picture {
			position: relative;
			border-radius: 5px;
			max-height: 50px;

			box-shadow: 0 0 0 1px rgb(46 46 46);
			img {
				object-fit: cover;
				border-radius: 5px;
				width: 50px;
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

		@media (min-width: 500px) {
			grid-template-columns: 100px 1fr;

			picture {
				max-height: 100px;
				img {
					width: 100px;
					height: 100px;
				}
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
				min-height: 2em;
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
