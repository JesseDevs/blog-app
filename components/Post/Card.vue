<template>
	<NuxtLink
		class="card-link"
		v-if="userProfile"
		:to="`${userProfile.username}/posts/${post.id}`"
		@click="handleOutsideCardBtnsShown"
	>
		<post-card>
			<transition name="fade">
				<card-btns-shown v-if="showModal">
					<ClientOnly>
						<button @click.prevent="deletePost(post.id)">
							<span class="small-voice">DELETE</span>
						</button>

						<button @click.prevent="copyLink">
							<span class="small-voice">SHARE</span>
						</button>

						<button
							class="like-btn"
							:class="{ 'is-liked': isLiked, 'is-not-liked': !isLiked }"
							@click.prevent="likePost(post.id)"
						>
							<span class="small-voice">
								{{ isLiked ? 'UNLIKE' : 'LIKE' }}
								<span class="like-count tiny-voice">{{
									totalLikes
								}}</span>
							</span>
							<br />
						</button>
					</ClientOnly>
				</card-btns-shown>
			</transition>
			<card-btns :class="{ active: showModal }">
				<button
					@click.prevent="toggleBtnsModal"
					v-if="currentUser?.id === userProfile?.id"
					class="show-btns"
				>
					<Icon name="mdi:dots-horizontal" size="25px" />
				</button>
			</card-btns>

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
	import { formattedDate, formatTime } from '~/utils/dateUtils';
	import readingTime from '~/utils/readingTime';
	const props = defineProps({
		post: Object,
		userProfile: Object,
	});

	const showModal = ref(false);

	const handleOutsideCardBtnsShown = (event) => {
		if (showModal == true) {
			if (!event.target.closest('.card-btns-shown')) {
				showModal.value = false;
			}
		}
	};

	const client = useSupabaseClient();
	const user = useSupabaseUser();
	const route = useRoute();
	const router = useRouter();
	const currentUser = ref(null);

	const totalLikes = ref(0);
	const isLiked = ref(false);

	const copyLink = () => {
		const url = `${window.location.origin}/${props.userProfile.username}/posts/${props.post.id}`;
		navigator.clipboard.writeText(url);
		showModal.value = false;
		notifyUser('Link copied to clipboard');
	};

	const notifyUser = (message) => {
		// Use your preferred notification method here (e.g., toast, alert)
		alert(message);
	};

	const toggleBtnsModal = () => {
		showModal.value = !showModal.value;
	};

	// it works
	const likePost = async (postId) => {
		try {
			if (isLiked.value) {
				const { data, error } = await client
					.from('likes')
					.select('id')
					.eq('post_id', postId)
					.eq('user_id', user.value.id)
					.single();

				if (error) {
					throw new Error('Error checking if liked: ' + error.message);
				}

				if (data) {
					await client.from('likes').delete().eq('id', data.id);
					totalLikes.value--;
					isLiked.value = false;
				}
			} else {
				await client
					.from('likes')
					.insert({ post_id: postId, user_id: user.value.id });
				totalLikes.value++;
				isLiked.value = true;
			}
		} catch (error) {
			console.error('Error liking/unliking post:', error.message);
		}
	};

	const fetchTotalLikes = async () => {
		try {
			const { data: likes, error } = await client
				.from('likes')
				.select('id')
				.eq('post_id', props.post.id);

			if (error) {
				throw new Error('Error fetching likes: ' + error.message);
			}

			totalLikes.value = likes.length;

			if (user.value) {
				const { data: liked, error: likeError } = await client
					.from('likes')
					.select('id')
					.eq('post_id', props.post.id)
					.eq('user_id', user.value.id);

				if (likeError) {
					throw new Error('Error checking if liked: ' + likeError.message);
				}

				isLiked.value = liked.length > 0;
			}
		} catch (error) {
			console.error('Error fetching likes:', error.message);
		}
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

	const deletePost = async (postId) => {
		const confirmed = confirm('Are you sure you want to delete this post?');
		showModal.value = false;

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

	onMounted(async () => {
		await fetchCurrentUser();
		await fetchTotalLikes();
	});
</script>

<style lang="scss">
	.like-btn {
		span {
			position: relative;
			span.like-count {
				position: absolute;
				pointer-events: none;
				top: -10px;
				right: -8px;
			}
		}
	}
	.is-liked {
		background-color: var(--liked-red);
		border-bottom-left-radius: 0px;
		border-bottom-right-radius: 0px;

		p {
			transition: background-color 0.3s ease-in-out;
		}
		+ .is-liked {
			border-radius: 0px;
		}
	}

	post-card {
		text-content {
			pointer-events: none;
			padding-right: 20px;
		}
	}
</style>
