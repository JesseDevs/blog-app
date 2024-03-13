<template>
	<section class="create-post" @click="handleTextBoxContainerClick">
		<inner-column>
			<create-block>
				<form @submit.prevent="addPost()" autocomplete="off">
					<div
						@click="openFileInput"
						class="field add-picture"
						:class="{ hidden: postImage.preview }"
					>
						<Icon
							name="material-symbols:perm-media-outline-rounded"
							size="40"
						/>
						<p>Add Thumbnail</p>
						<input
							ref="fileInput"
							type="file"
							name="image"
							id=""
							accept="image/*"
							style="display: none"
							@change="onImageUpload"
						/>
					</div>

					<picture v-if="postImage.preview" class="image-upload-preview">
						<img :src="postImage.preview" alt="image-upload-preview" />
						<button @click.prevent="removeImageData">
							<Icon name="ic:round-close" size="25" />
						</button>
					</picture>

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
					<ClientOnly>
						<div class="field text-content editor-container">
							<QuillEditor
								theme="snow"
								v-model:content="postData.content"
							/>
						</div>
					</ClientOnly>

					<button class="button-filled" type="submit">Add Post</button>
				</form>
			</create-block>
			<LoadingContainer v-if="loading" :text="loadingText" />
			<transition name="fade" appear>
				<error-box v-if="errorMessage">
					<text-content>
						<p class="level-two-voice">{{ errorMessage }}</p>
					</text-content>

					<button class="close-btn" @click="closeErrorBox">
						<Icon name="carbon:close" size="21" />
					</button>
				</error-box>
			</transition>
		</inner-column>
	</section>
</template>

<script setup>
	definePageMeta({
		middleware: 'auth',
	});

	const client = useSupabaseClient();
	const router = useRouter();
	const user = useSupabaseUser();
	const success = ref(false);
	const loading = ref(false);
	const loadingText = ref(`Submitting,<br /> your post...`);
	const errorMessage = ref(false);

	const postImage = ref({
		preview: null,
	});
	const fileInput = ref(null);

	const postData = ref({
		header: '',
		content: '',
		image: null,
	});

	const closeErrorBox = () => {
		errorMessage.value = null;
	};

	const openFileInput = () => {
		// trigger click event of file input
		fileInput.value.click();
	};

	const generateUniqueFilename = (header) => {
		const randomNumber = Math.floor(1000 + Math.random() * 9000);
		const sanitizedHeader = header.replace(/[<>:"/\\|?*]/g, '_'); // Replace invalid characters with underscore
		return `${sanitizedHeader.replace(/\s+/g, '-').toLowerCase()}-${randomNumber}`; // Replace spaces with hyphens and add the random number
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
			loading.value = true;

			if (!postData.value.header || !postData.value.content) {
				console.error('Header or content is empty');
				return;
			}

			const { path, filename } = await uploadImage(postData.value.image);
			if (!filename) {
				console.error('Filename is empty');
				return;
			}

			const { data, error } = await client.from('posts').insert([
				{
					belongs_to: user.value.id,
					header: postData.value.header,
					content: postData.value.content,
					date_created: new Date().toISOString().split('T')[0],
					time_created: new Date().toISOString().split('T')[1].split('.')[0],
					image_url: filename,
				},
			]);

			if (error) {
				console.error('Error inserting data:', error);
				errorMessage.value = error.message;
			} else {
				console.log('Data inserted successfully:', data);

				success.value = true;
				setTimeout(() => {
					loading.value = false;

					router.push('/');
				}, 1250);
			}
		} catch (error) {
			console.error('Error:', error.message);
			errorMessage.value = error.message;
			loading.value = false;
		}
	};

	const postContentTextarea = ref(null);

	function adjustTextareaHeight() {
		if (postContentTextarea.value) {
			postContentTextarea.value.style.height = `${postContentTextarea.value.scrollHeight}px`;
		}
	}

	const resetImagePreview = () => {
		postImage.value.preview = null;
	};

	const removeImageData = () => {
		postImage.value.preview = null;
		postData.value.image = null;
	};

	onBeforeRouteLeave((to, from, next) => {
		resetImagePreview();
		next();
	});
</script>

<style lang="scss" scoped>
	error-box {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		max-width: 80%;
		min-height: 250px;
		background-color: var(--button-bg-hover);
		display: grid;
		// box-shadow: inset 5px 5px 10px rgb(var(--button-bg-rgb) / 0.7),
		// 	inset -5px -5px 10px rgb(var(--button-bg-rgb) / 0.7);
		place-items: center;
		border-radius: 5px;
		p {
			text-align: center;
		}

		button {
			position: absolute;
			top: 1rem;
			right: 1rem;
		}
	}
	.hidden {
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: none;
		height: 0;
		padding: 0;
		margin: 0;
	}
	section.create-post {
		inner-column {
			padding-top: 1rem;
		}

		.placeholder {
			position: absolute;
			color: rgb(127, 126, 126);
		}

		.placeholder.disappear {
			opacity: 0;
			display: none;
		}
	}
	back-button {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		border: var(--button-bg) var(--thin) solid;
		border-radius: 999px;
		height: 50px;
		width: 50px;
		&:hover {
			background-color: var(--button-bg);
		}
	}
	create-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		gap: 40px;

		form {
			display: flex;
			width: 100%;
			flex-direction: column;
			gap: 20px;
			min-height: 80vh;

			.button-filled {
				margin-top: 0;
			}
		}

		textarea.text-title {
			width: 100%;
			font-size: inherit;
			outline: none;
			border: none;
			background-color: transparent;
			z-index: 0;
			color: var(--white);
			resize: none;
			height: 47px;

			&::placeholder {
				color: rgb(var(--white-rgb) / 0.65);
			}
		}

		div.field {
			display: flex;
			flex-direction: column;
			width: 100%;
			position: relative;
			input {
				width: 100%;
			}
		}

		div.text-content {
			display: flex;
			align-items: stretch;
			p {
				border-top: var(--thin) solid var(--text-faded);
				padding-top: 10px;
				outline: none;
				padding-left: 3px;
				line-height: 2;
				height: 100%;
				flex: 1;
			}
		}

		div.add-picture {
			cursor: pointer;
			flex-direction: row;
			align-items: center;
			padding-top: 30px;
			gap: 10px;
			color: rgb(var(--white-rgb) / 0.65);
			p {
				text-transform: uppercase;
				letter-spacing: 0.02em;
				font-weight: 800;
			}
		}

		div.header {
			position: relative;
			border: none;

			textarea {
				font-weight: 700;
			}

			label {
				font-weight: 700;
				opacity: 0;
				font-size: inherit;
			}

			&::after {
				content: '';
				position: absolute;
				left: 0;
				bottom: 5px;
				height: 2px;
				width: 20px;
				width: var(--width-percentage);
				background-color: var(--white);
				transition: width 0.3s;
			}
		}

		div.create-actions {
			display: flex;
			width: 100%;
			gap: 40px;

			back-button {
				flex-shrink: 0;
			}
		}
	}

	.image-upload-preview {
		border-radius: 5px;
		position: relative;
		overflow: hidden;
		display: block;
		width: 100%;
		height: 300px;
		margin: 0 auto;

		button {
			appearance: none;
			border: none;
			outline: none;
			background-color: var(--button-bg);
			cursor: pointer;
			position: absolute;
			top: 2px;
			right: 2px;
			border-radius: 5px;

			svg {
				color: var(--white);
			}
		}

		img {
			object-fit: contain;
			height: 100%;
			width: 100%;
			border-radius: 6px;
			transition: opacity 0.5s;
		}
	}

	.close-btn {
		cursor: pointer;
		border-radius: 3px;
		font-weight: 700;
		border: none;
		padding: 4px;
		margin-left: auto;
		margin-bottom: 30px;
		appearance: none;
		background-color: var(--background);
		transition: background-color 0.3s ease-in-out;
		&:hover {
			background-color: var(--button-bg);
		}

		svg {
			stroke-width: 4px !important;
			color: var(--white);
		}
	}
</style>
