<template>
	<NuxtLink
		class="card-link"
		v-if="userProfile"
		:to="`${userProfile.username}/posts/${post.id}`"
	>
		<post-card>
			<card-header>
				<button
					v-if="currentUser?.id === userProfile?.id"
					@click.prevent="deletePost(post.id)"
					class="delete-btn"
				>
					<Icon name="iconamoon:trash" />
				</button>

				<button @click.prevent="copyLink" class="share-btn">
					<Icon name="material-symbols:ios-share-rounded" />
				</button>
			</card-header>
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
				<p v-html="post.content" class="visible-content"></p>
			</text-content>
			<card-footer class="small-voice">
				<p class="faded">{{ formatTime(post.time_created) }}</p>
				<p>
					<Icon name="ph:dot-outline-fill" />
				</p>
				<p class="faded">{{ formattedDate(post.date_created) }}</p>
				<p>
					<Icon name="ph:dot-outline-fill" />
				</p>
				<p class="reading-time faded">{{ readingTime(post.content) }}</p>
			</card-footer>
		</post-card>
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
	const route = useRoute();
	const router = useRouter();
	const currentUser = ref(null);

	const copyLink = () => {
		const url = `${window.location.origin}/${props.userProfile.username}/posts/${props.post.id}`;
		navigator.clipboard.writeText(url);
		notifyUser('Link copied to clipboard');
	};

	const notifyUser = (message) => {
		// Use your preferred notification method here (e.g., toast, alert)
		alert(message);
	};

	const fetchCurrentUser = async () => {
		try {
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
		} catch (error) {
			console.error('Error fetching user profile:', error.message);
		}
	};

	const imageLoaded = ref(false);
	const fallbackImageUrl = '/images/fallback-logo.jpg';

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

	const deletePost = async (postId) => {
		const confirmed = confirm('Are you sure you want to delete this post?');

		if (!confirmed) {
			return;
		}
		try {
			const { error } = await client.from('posts').delete().eq('id', postId);

			if (error) {
				console.error('Error deleting post:', error.message);
			} else {
				console.log('deleted post');
				router.go();
			}
		} catch (error) {
			console.error('Error deleting post:', error.message);
		}
	};

	const handleButtonClick = () => {
		// Your button click handler logic here
		console.log('Button clicked');
	};

	onMounted(async () => {
		await fetchCurrentUser();
	});
</script>

<style lang="scss">
	.liked {
		background-color: var(--required-red);
	}

	// .card-link {
	// 	pointer-events: none;
	// }

	post-card {
		text-content {
			pointer-events: none;
			padding-right: 40px;
		}
	}

	.delete-btn,
	.share-btn {
		display: flex;
		grid-column: 1/-1;
		appearance: none;
		width: 100%;
		height: 100%;
		border: none;
		outline: none;
		color: var(--white);
		background-color: transparent;
		cursor: pointer;
		pointer-events: all;

		align-items: center;
		justify-content: center;
		svg {
			width: 23px;
			height: 23px;
			pointer-events: none;
			transition: color 0.2s ease-in-out;
			color: var(--text-faded);
			path {
				pointer-events: none;
			}
		}

		&::after {
			content: '';
			padding: 8px;
			width: 25px;
			height: 25px;
			border-radius: 999px;
			background-color: var(--required-red);
			position: absolute;
			opacity: 0;
			transition: opacity 0.2s ease-in-out;
		}
		&:hover {
			svg {
				color: var(--required-red);
			}
			&::after {
				opacity: 0.2;
			}
		}
	}

	.share-btn {
		&::after {
			background-color: green;
		}
		&:hover {
			svg {
				color: green;
			}
			&::after {
				opacity: 0.2;
			}
		}
	}
</style>
