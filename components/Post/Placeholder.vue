<template>
	<post-card>
		<picture>
			<img :src="placeholder.img" alt="Fallback Image" loading="eager" />
			<div class="vignette-overlay"></div>
		</picture>

		<text-content>
			<h3 class="level-one-voice">{{ placeholder.header }}</h3>
			<p v-html="placeholder.content" class="visible-content"></p>
		</text-content>
		<card-footer class="small-voice">
			<p class="faded">{{ placeholder.timeCreated }}</p>
			<p>
				<Icon name="ph:dot-outline-fill" />
			</p>
			<p class="faded">{{ placeholder.dateCreated }}</p>
			<p>
				<Icon name="ph:dot-outline-fill" />
			</p>
			<p class="reading-time faded">{{ placeholder.readingTime }}</p>
		</card-footer>
	</post-card>
</template>

<script setup>
	const placeholder = reactive({
		img: '/images/fallback-logo.jpg',
		header: 'Header',
		content: 'Lorem ipsum is placeholder text commonly used in the graphic.',
		timeCreated: '10:00am',
		dateCreated: 'June 22, 2024',
		readingTime: '1 MIN READ',
	});
	const showModal = ref(false);

	const imageLoaded = ref(false);
</script>

<style lang="scss" scoped>
	// post-card {
	// 	padding: 1rem 1.5rem;
	// }

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
