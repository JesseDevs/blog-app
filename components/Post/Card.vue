<template>
	<NuxtLink v-if="userProfile && user" :to="`${userProfile.username}/posts/${post.id}`">
		<post-card>
			<h3 class="level-one-voice">{{ post.title }}</h3>

			<text-content>
				<p class="visible-content">{{ post.content }}</p>
				<div class="blurred"></div>
			</text-content>

			<card-details class="small-voice">
				<p class="faded">10:17 PM</p>
				<p>
					<Icon name="ph:dot-outline-fill" />
				</p>
				<p class="faded">Dec 1, 2023</p>
				<p>
					<Icon name="ph:dot-outline-fill" />
				</p>
				<p class="reading-time">{{ readingTime(post.content) }}</p>
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
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 5px;
		width: 100%;
		position: relative;

		h3 {
			font-weight: 700;
			font-style: italic;
		}

		text-content {
			overflow: hidden;
			position: relative;
			p.visible-content {
				max-height: 6em;
				padding-left: 10px;
				padding-right: 10px;
			}

			.blurred {
				background: rgba(0, 0, 0, 0.05);
				box-shadow: 0 0px 0px 0 rgba(10, 18, 132, 0.37);
				backdrop-filter: blur(2.5px);

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
		display: flex;
		align-self: flex-end;
		align-items: baseline;
		gap: 2px;

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
