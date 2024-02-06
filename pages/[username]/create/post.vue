<template>
	<section class="login">
		<inner-column>
			<create-block>
				<form @submit.prevent="addPost()" autocomplete="off">
					<div class="field add-picture">
						<Icon name="iconoir:plus-square-dashed" size="50" />
						<p>Add Your Thumbnail</p>

						<img
							v-if="postImage.preview"
							:src="postImage.preview"
							alt="image-upload-preview"
							style="width: 200px; height: 200px"
						/>
						<input
							type="file"
							name="image"
							id=""
							accept="image/*"
							@change="onImageUpload"
						/>
					</div>

					<div class="field header level-three-voice">
						<textarea
							class="text-title"
							v-model="postData.header"
							placeholder="Enter title..."
							type="text"
							id="postHeading"
							required
							ref="postContentTextarea"
							@input="adjustTextareaHeight"
						></textarea>
					</div>

					<div class="field">
						<label for="postContent">Post Content:</label>
						<textarea
							v-model="postData.content"
							id="postContent"
							required
						></textarea>
					</div>

					<button class="button-filled" type="submit">Add Post</button>
				</form>

				{{ user.id }}
				{{ postData }}
			</create-block>
		</inner-column>
	</section>
</template>

<script setup>
	const client = useSupabaseClient();
	const router = useRouter();
	const user = useSupabaseUser();

	const postImage = ref({
		preview: null,
	});

	const postData = ref({
		header: '',
		content: 'This is the content of the post.',
		image: null,
	});

	const generateUniqueFilename = (header) => {
		const randomNumber = Math.floor(1000 + Math.random() * 9000);
		return `${header.replace(/\s+/g, '-').toLowerCase()}-${randomNumber}`; // Replace spaces with hyphens and add the random number
	};

	const onImageUpload = (event) => {
		const input = event.target;

		if (input.files) {
			const reader = new FileReader();
			reader.onload = (e) => {
				postImage.value.preview = e.target.result;
				postData.value.image = input.files[0];
			};
			reader.readAsDataURL(input.files[0]);
		}
	};

	const uploadImage = async (file) => {
		const filename = generateUniqueFilename(postData.value.header);

		try {
			const { data, error } = await client.storage
				.from('post-images')
				.upload(`${user.value.id}/${filename}`, file);

			if (data && data.path) {
				// console.log(data.path, filename);
				return { path: data.path, filename };
			} else {
				console.log(error);
				return null;
			}
		} catch (error) {
			console.error('Error uploading image:', error.message);
			return null;
		}
	};

	const addPost = async () => {
		try {
			const { path, filename } = await uploadImage(postData.value.image);
			const { data, error } = await client.from('posts').insert([
				{
					belongs_to: user.value.id,
					header: postData.value.header,
					content: postData.value.content,
					date_created: new Date().toISOString().split('T')[0],
					time_created: new Date().toISOString().split('T')[1].split('.')[0],
					likes: [],
					image_url: `${filename}`,
				},
			]);

			if (error) {
				console.error('Error inserting data:', error);
			} else {
				console.log('Data inserted successfully:', data);

				router.push({ name: '/' });
			}
		} catch (error) {
			console.error('Error:', error.message);
		}
	};

	const postContentTextarea = ref(null);

	function adjustTextareaHeight() {
		if (postContentTextarea.value) {
			postContentTextarea.value.style.height = `${postContentTextarea.value.scrollHeight}px`; // Set to scrollHeight
		}
	}

	const resetImagePreview = () => {
		postImage.value.preview = null;
	};

	onBeforeRouteLeave((to, from, next) => {
		resetImagePreview();
		next();
	});
</script>

<style lang="scss" scoped>
	create-block {
		display: block;
		width: 100%;
		position: relative;

		div.field {
			display: flex;
			flex-direction: column;
			width: 100%;
			position: relative;
			margin-bottom: 20px;
			input {
				width: 100%;
			}
		}

		div.add-picture {
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			gap: 10px;
			color: rgba(255, 255, 255, 0.8);
			p {
				text-transform: uppercase;
				letter-spacing: 0.02em;
			}
		}

		div.header {
			position: relative;
			border: none;
			padding-bottom: 5px;

			label {
				font-weight: 700;
				opacity: 0;
				font-size: inherit;
			}
			label.active {
				transform: translateY(-120%);
				font-size: 0.8em;
				color: #333;
			}
			textarea.text-title {
				width: 100%;
				font-size: inherit;
				outline: none;
				border: none;
				background-color: transparent;
				z-index: 0;
				color: white;

				resize: none;
				height: 44px;
				border-bottom: 2px solid red;
				&::placeholder {
					color: rgba(255, 255, 255, 0.4);
				}
			}

			&::after {
				content: '';
				position: absolute;
				left: 0;
				bottom: 5px;
				height: 2px;
				width: 20px;
				width: var(--width-percentage);
				background-color: white;
				transition: width 0.3s;
			}
		}
	}
</style>
