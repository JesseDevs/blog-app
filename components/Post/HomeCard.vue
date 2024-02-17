<template>
	<post-card>
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
			<h3 class="level-one-voice">{{ post.header }}</h3>
			<p class="visible-content">{{ truncatedText }}</p>
		</text-content>
	</post-card>
	<create-by> {{ username }}</create-by>
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

<style lang="scss"></style>
