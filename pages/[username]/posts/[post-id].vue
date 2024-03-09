<template>
	<section class="detail">
		<inner-column>
			<LoadingContainer v-if="!isDataLoaded" :text="loadingText" />

			<detail-page
				v-if="userProfile"
				:class="{ gone: !isDataLoaded, loaded: isDataLoaded }"
			>
				<picture>
					<img
						:src="`https://naduzuobtmmhavkozjxf.supabase.co/storage/v1/object/public/post-images/${post.belongs_to}/${post.image_url}?t=2024-01-30T08%3A07%3A46.058Z`"
						alt=""
						@error="handleImageError"
						@load="checkImageSize"
						loading="lazy"
						:style="{ objectFit: imageSize }"
					/>
				</picture>
				<h1 class="level-two-voice">{{ post.header }}</h1>
				<post-header>
					<div class="user-content">
						<p>
							<a
								class="post-user"
								@click.stop
								:href="`/${userProfile.username}`"
							>
								{{ userProfile.username }}</a
							>
						</p>

						<p class="faded">{{ formattedDate(post.date_created) }}</p>
					</div>
					<div class="btn-actions">
						<button
							v-if="currentUser?.id === userProfile?.id"
							@click.prevent="deletePost(post.id)"
							class="delete-btn"
						>
							<Icon name="material-symbols:delete-outline-rounded" />
						</button>

						<button @click.prevent="copyLink" class="share-btn">
							<Icon name="material-symbols:ios-share-rounded" />
						</button>

						<button
							:class="{ 'is-liked': isLiked, 'is-not-liked': !isLiked }"
							@click.prevent="likePost(post.id)"
							class="like-btn"
						>
							<Icon name="material-symbols:favorite" />
						</button>
						<p class="small-voice">
							Likes:<span>{{ totalLikes }}</span>
						</p>
					</div>
				</post-header>
				<text-content>
					<div class="detail-post-content" v-html="post.content"></div>
				</text-content>
			</detail-page>
		</inner-column>
	</section>
</template>

<script setup>
	const client = useSupabaseClient();
	const user = useSupabaseUser();
	const userProfile = ref(null);
	const currentUser = ref(null);
	const route = useRoute();
	const router = useRouter();
	const post = ref({});
	const isDataLoaded = ref(false);
	const loadingText = ref('Loading...');

	const imageSize = ref('cover');

	const imageLoaded = ref(false);
	const fallbackImageUrl = '/images/fallback-logo.jpg';

	const totalLikes = ref(0);
	const isLiked = ref(false);

	const checkImageSize = (event) => {
		const img = event.target;
		console.log(img.naturalHeight);
		if (img.naturalHeight > 400) {
			console.log('contain');
			imageSize.value = 'contain';
		}
		imageLoaded.value = true;
	};

	const handleImageError = (event) => {
		event.target.src = '/images/fallback-logo.jpg';
	};

	const formattedDate = (dateString) => {
		const options = { month: 'short', day: 'numeric', year: 'numeric' };
		const date = new Date(dateString);
		return date.toLocaleDateString(undefined, options);
	};

	const copyLink = () => {
		const url = `${window.location.origin}/${userProfile.value.username}/posts/${post.value.id}`;
		navigator.clipboard.writeText(url);
		notifyUser('Link copied to clipboard');
	};

	const notifyUser = (message) => {
		alert(message);
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
				.eq('post_id', post.value.id);

			if (error) {
				throw new Error('Error fetching likes: ' + error.message);
			}

			totalLikes.value = likes.length;

			if (user.value) {
				const { data: liked, error: likeError } = await client
					.from('likes')
					.select('id')
					.eq('post_id', post.value.id)
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
				router.push('/');
			}
		} catch (error) {
			console.error('Error deleting post:', error.message);
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

	const fetchPostDetail = async () => {
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
	};

	const fetchUserProfile = async () => {
		try {
			const { data, error } = await client
				.from('profiles')
				.select('*')
				.eq('id', post.value.belongs_to)
				.single();

			if (error) {
				console.error('Error fetching user profile:', error.message);
			} else {
				userProfile.value = data;
			}
		} catch (error) {
			console.error('Error fetching user profile:', error.message);
		}
	};

	onMounted(async () => {
		await fetchPostDetail();
		await fetchCurrentUser();
		await fetchUserProfile();
		await fetchCurrentUser();
		await fetchTotalLikes();

		setTimeout(() => {
			isDataLoaded.value = true;
		}, 800);
	});
</script>

<style lang="scss" scoped>
	.loaded {
		opacity: 1;
		transition: opacity 0.5s;
	}

	.gone {
		opacity: 0;
	}
	detail-page {
		display: flex;
		flex-direction: column;
		width: 100%;
		position: relative;

		h1 {
			font-weight: 700;
			text-transform: uppercase;
			word-break: break-word;
			font-family: 'Roboto Slab', serif;
			letter-spacing: 0.07em;
			line-height: 1.1;
			padding-top: 30px;
		}

		post-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: relative;
			width: 100%;
			border-bottom: var(--thin) solid var(--text-faded);
			padding-top: 10px;
			padding-bottom: 5px;

			.user-content {
				display: flex;
				flex-direction: column;
				align-items: flex-start;

				p {
					font-size: var(--size-sm);
					a {
						font-size: inherit;
						padding-left: 15px;
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
							bottom: -1px;
							right: 0;
						}
						&:before {
							content: '@';
							position: absolute;
							left: 0;
							top: -3px;
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

			p.faded {
				color: var(--text-faded);
			}
		}

		text-content {
			display: flex;
			flex-direction: column;

			.detail-post-content {
				padding-top: 30px;
			}
		}

		picture {
			position: relative;
			border-radius: 5px;
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			overflow: hidden;
			max-width: 400px;
			max-height: 400px;

			&:before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;

				background: var(--black);
				background: radial-gradient(
					circle,
					rgb(var(--white-rgb) / 0) 0%,
					rgba(var(--black-rgb) / 0.6) 90%
				);
				opacity: 0.9;
				transition: opacity 0.5s;
			}

			&:hover::before {
				opacity: 0;
			}

			img {
				border-radius: 6px;
				transition: opacity 0.5s;
			}
		}
	}

	.btn-actions {
		display: flex;
		gap: 15px;
	}

	.delete-btn,
	.share-btn,
	.like-btn {
		display: flex;

		appearance: none;
		width: 100%;
		height: 100%;
		border: none;
		outline: none;
		color: white;
		background-color: transparent;
		cursor: pointer;
		pointer-events: all;

		align-items: center;
		justify-content: center;
		svg {
			width: 23px;
			height: 23px;
			pointer-events: none;
			transition: color 0.2s ease-in-out, transform 0.3s ease;
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
				transform: scale(1.1);
			}
			&::after {
				opacity: 0.2;
			}
		}
	}

	.share-btn {
		&::after {
			background-color: var(--success-green);
		}
		&:hover {
			svg {
				color: rgb(51, 181, 51);
			}
			&::after {
				opacity: 0.2;
			}
		}
	}

	.like-btn {
		&::after {
			background-color: var(--liked-red);
		}
		&:hover {
			svg {
				color: rgb(186, 42, 42);
			}
			&::after {
				opacity: 0.2;
			}
		}
	}

	.is-liked.like-btn {
		svg {
			color: rgb(186, 42, 42);
		}
	}
</style>
