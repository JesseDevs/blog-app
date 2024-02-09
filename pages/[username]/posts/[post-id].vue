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
					<div class="vignette-overlay"></div>
				</picture>

				<h1>{{ post.header }}</h1>
				<p>{{ post.content }}</p>
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

	onMounted(async () => {
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
	});
</script>

<style lang="scss" scoped>
	detail-page {
		display: flex;
		flex-direction: column;
		width: 100%;
		position: relative;

		picture {
			position: relative;

			img {
				object-fit: cover;
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
