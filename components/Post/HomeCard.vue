<template>
	<NuxtLink :to="`${userProfile.username}/posts/${post.id}`">
		<div v-if="isPinnedInExploreCards && post.pinned" class="pinned-box">
			<Icon name="codicon:pinned-dirty" size="20" />
			<p class="small-voice">PINNNED POST</p>
		</div>
		<post-card class="home-card">
			<transition name="fade">
				<card-btns-shown v-if="showModal" @click.stop>
					<button
						@click.prevent="deletePost(post.id)"
						v-if="currentUser?.id === userProfile?.id"
					>
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
							<span class="like-count tiny-voice">{{ totalLikes }}</span>
						</span>
						<br />
					</button>
				</card-btns-shown>
			</transition>
			<card-btns :class="{ active: showModal }">
				<button @click.prevent="toggleBtnsModal" class="show-btns">
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
					:src="`https://naduzuobtmmhavkozjxf.supabase.co/storage/v1/object/public/post-images/${post.belongs_to}/${post.image_url}?t=2024-01-30T08%3A07%3A46.058Z`"
					alt=""
					@error="handleImageError"
					@load="imageLoaded = true"
					loading="lazy"
				/>
				<div class="vignette-overlay"></div>
			</picture>

			<text-content>
				<a class="post-user" @click.stop :href="`/${userProfile.username}`">
					{{ userProfile.username }}</a
				>

				<h3 class="level-one-voice">{{ post.header }}</h3>
				<p v-html="post.content" class="visible-content"></p>
			</text-content>
			<card-footer class="small-voice">
				<p class="faded">{{ formatTimeNew(post.time_created) }}</p>
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
	{{ post.time_created }}
</template>

<script setup>
	import { formattedDate, formatTimeNew } from '~/utils/dateUtils';
	import readingTime from '~/utils/readingTime';
	const props = defineProps({
		post: Object,
		userProfile: Object,
		isPinnedInExploreCards: Boolean,
	});

	const showModal = ref(false);

	const client = useSupabaseClient();
	const user = useSupabaseUser();

	const route = useRoute();
	const router = useRouter();
	const userPosts = ref([]);
	const imageLoaded = ref(false);
	const fallbackImageUrl = '/images/fallback-logo.jpg';
	const username = ref('');
	const currentUser = ref(null);

	const totalLikes = ref(0);
	const isLiked = ref(false);

	const toggleBtnsModal = () => {
		showModal.value = !showModal.value;
	};

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

	const handleImageError = (event) => {
		event.target.src = '/images/fallback-logo.jpg';
	};

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

	const deletePost = async (postId) => {
		const confirmed = confirm('Are you sure you want to delete this post?');
		showModal.value = false;

		if (!confirmed) {
			return;
		}
		try {
			const { data: post, error: fetchError } = await client
				.from('posts')
				.select('image_url')
				.eq('id', postId)
				.single();

			if (fetchError) {
				throw fetchError;
			}
			if (post && post.image_url) {
				const filePath = `${user.value.id}/${post.image_url}`;
				const { error: deleteError } = await client.storage
					.from('post-images')
					.remove([filePath]);
				if (deleteError) {
					throw deleteError;
				}
				console.log('Image deleted successfully from storage.');
			}

			// Now you can delete the post from the database
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
	.pinned-box {
		border-top: var(--thin) solid var(--text-faded);
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 20px;
		padding: 3px 2rem;
		background: linear-gradient(
			0.25turn,
			rgb(199, 166, 82) 0%,
			rgba(199, 166, 82, 0.767) 50%,
			rgb(199, 166, 82)
		);

		border-bottom: 1px solid rgb(191, 145, 29);
		p {
			font-weight: 600;
		}
	}
	.home-card {
		text-content {
			position: relative;
			pointer-events: all;

			.post-user {
				font-weight: 500;
				opacity: 0.7;
				padding-left: 18px;
				width: fit-content;
				transition: opacity 0.2s ease-in-out;
				position: relative;
				&:after {
					content: '';
					opacity: 0.7;
					height: 1.5px;
					width: calc(100% - 15px);
					position: absolute;
					background-color: var(--white);

					opacity: 0;
					transition: opacity 0.2s ease-in-out;
					bottom: 0px;
					right: 0;
				}
				&:before {
					content: '@';
					position: absolute;
					left: 0;
					top: -1px;
				}
				&:hover {
					opacity: 1;

					&:after {
						opacity: 1;
					}
				}
			}
		}
	}

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
</style>
