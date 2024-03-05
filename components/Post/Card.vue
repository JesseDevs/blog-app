<template>
	<NuxtLink
		class="card-link"
		v-if="userProfile"
		:to="`${userProfile.username}/posts/${post.id}`"
	>
		<post-card>
			<card-btns :class="{ active: showModal }">
				<button
					@click.prevent="toggleBtnsModal"
					v-if="currentUser?.id === userProfile?.id"
					class="show-btns"
				>
					<Icon name="mdi:dots-horizontal" size="25px" />
				</button>
			</card-btns>
			<transition name="fade">
				<card-btns-shown v-if="showModal">
					<button @click.prevent="deletePost(post.id)" class="delete-btn">
						<span class="small-voice">DELETE</span>
					</button>

					<button @click.prevent="copyLink" class="share-btn">
						<span class="small-voice">SHARE</span>
					</button>
				</card-btns-shown>
			</transition>

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

	const showModal = ref(false);

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

	const toggleBtnsModal = () => {
		showModal.value = !showModal.value;
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
		console.log('Button clicked');
	};

	onMounted(async () => {
		await fetchCurrentUser();
	});
</script>

<style lang="scss">
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.2s;
	}
	.fade-enter,
	.fade-leave-to {
		transition: opacity 0.2s;
		opacity: 0;
		filter: blur(1px);
	}

	.liked {
		background-color: var(--required-red);
	}

	post-card {
		text-content {
			pointer-events: none;
			padding-right: 40px;
		}
	}
</style>
