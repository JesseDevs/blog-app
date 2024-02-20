<template>
	<section class="detail">
		<inner-column>
			<detail-page>
				<picture>
					<img
						:src="`https://naduzuobtmmhavkozjxf.supabase.co/storage/v1/object/public/post-images/${post.belongs_to}/${post.image_url}?t=2024-01-30T08%3A07%3A46.058Z`"
						alt=""
						@error="handleImageError"
						@load="imageLoaded = true"
						loading="lazy"
					/>
				</picture>
				<text-content>
					<h1 class="level-two-voice">{{ post.header }}</h1>
					<p>{{ post.content }}</p>
				</text-content>
			</detail-page>
		</inner-column>
	</section>
</template>

<script setup>
	const client = useSupabaseClient();
	const user = useSupabaseUser();
	const userProfile = ref(null);
	const route = useRoute();
	const post = ref({});

	const imageLoaded = ref(false);
	const fallbackImageUrl = '/images/fallback-logo.jpg';

	const handleImageError = (event) => {
		event.target.src = '/images/fallback-logo.jpg';
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

	onMounted(fetchPostDetail);
</script>

<style lang="scss" scoped>
	detail-page {
		display: flex;
		flex-direction: column;
		width: 100%;
		position: relative;

		text-content {
			display: flex;
			flex-direction: column;

			h1 {
				font-weight: 700;
				text-transform: uppercase;
				word-break: break-word;
				font-family: 'Roboto Slab', serif;
				letter-spacing: 0.07em;
				line-height: 1.1;
			}
		}

		picture {
			position: relative;
			border-radius: 5px;
			position: relative;
			overflow: hidden;

			&:before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-image: linear-gradient(
					to bottom,
					rgb(var(--background-rgb) / 0.4) 0%,
					var(--background) 100%
				);
				opacity: 0.9;
				transition: opacity 0.5s;
			}

			&:hover::before {
				opacity: 0;
			}

			img {
				object-fit: cover;
				border-radius: 5px;
				transition: opacity 0.5s;
			}

			.vignette-overlay {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: rgb(255, 255, 255);
				background: radial-gradient(
					circle,
					rgba(255, 255, 255, 0) 0%,
					rgba(0, 0, 0, 0.6) 90%
				);
				pointer-events: none;
			}
		}
	}
</style>
