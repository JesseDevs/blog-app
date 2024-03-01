<template>
	<post-card class="home-card">
		<card-header>
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
				:src="`https://naduzuobtmmhavkozjxf.supabase.co/storage/v1/object/public/post-images/${post.belongs_to}/${post.image_url}?t=2024-01-30T08%3A07%3A46.058Z`"
				alt=""
				@error="handleImageError"
				@load="imageLoaded = true"
				loading="lazy"
			/>
			<div class="vignette-overlay"></div>
		</picture>

		<text-content>
			<a class="post-user" @click.stop :href="`/${username}`"> {{ username }}</a>

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
</template>

<script setup>
	import readingTime from '~/utils/readingTime';
	const props = defineProps({
		post: Object,
	});

	const client = useSupabaseClient();
	const user = useSupabaseUser();
	const userPosts = ref([]);
	const imageLoaded = ref(false);
	const fallbackImageUrl = '/images/fallback-logo.jpg';

	const fetchUsernameById = async (id) => {
		try {
			const { data, error } = await client
				.from('profiles')
				.select('username')
				.eq('id', id)
				.single();

			if (error) {
				throw error;
			}

			if (data) {
				return data.username;
			}

			return '';
		} catch (error) {
			console.error('Error fetching username:', error.message);
			return '';
		}
	};

	const getUserByUsername = async (id) => {
		try {
			const username = await fetchUsernameById(id);
			return username;
		} catch (error) {
			console.error('Error fetching username:', error.message);
			return '';
		}
	};

	const copyLink = () => {
		const url = `${window.location.origin}/${username.value}/posts/${props.post.id}`;
		navigator.clipboard.writeText(url);
		notifyUser('Link copied to clipboard');
	};

	const notifyUser = (message) => {
		// Use your preferred notification method here (e.g., toast, alert)
		alert(message);
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

	const username = ref('');

	onMounted(async () => {
		if (props.post && props.post.belongs_to) {
			username.value = await getUserByUsername(props.post.belongs_to);
		}
	});
</script>

<style lang="scss">
	.home-card {
		text-content {
			position: relative;
			pointer-events: all;

			.post-user {
				font-weight: 500;
				opacity: 0.7;
				padding-left: 17px;
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
					bottom: -2px;
					right: 0;
				}
				&:before {
					content: '@';
					position: absolute;
					left: 0;
				}
				&:hover {
					opacity: 1;

					&:after {
						opacity: 1;
					}
				}
			}
		}
		card-header {
			max-width: 45px;
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
				background-color: red;
				position: absolute;
				opacity: 0;
				transition: opacity 0.2s ease-in-out;
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
	}
</style>
