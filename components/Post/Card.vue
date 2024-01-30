<template>
	<NuxtLink v-if="userProfile && user" :to="`${userProfile.username}/posts/${post.id}`">
		<post-card>
			<picture>
				<img
					:src="`https://naduzuobtmmhavkozjxf.supabase.co/storage/v1/object/public/post-images/${userProfile.id}/${post.image_url}?t=2024-01-30T08%3A07%3A46.058Z`"
					alt=""
				/>
			</picture>

			<text-content>
				<h3 class="level-one-voice">{{ post.header }}</h3>
				<p class="visible-content">{{ post.content }}</p>
				<div class="blurred"></div>
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
		</post-card>
	</NuxtLink>
</template>

<script setup>
	import readingTime from '~/utils/readingTime';
	const props = defineProps({
		post: Object,
	});

	const client = useSupabaseClient();

	const user = useSupabaseUser();
	const userProfile = ref(null);

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
	});
</script>

<style lang="scss" scoped>
	post-card {
		display: grid;
		grid-template-columns: 100px 1fr;
		column-gap: 10px;
		row-gap: 20px;
		width: 100%;
		position: relative;

		h3 {
			font-weight: 700;
			text-transform: uppercase;
		}

		text-content {
			overflow: hidden;
			position: relative;
			font-style: italic;
			grid-column: 2/-1;
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
		justify-content: flex-end;
		gap: 2px;
		border-top: 1px solid var(--faded-text);
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
