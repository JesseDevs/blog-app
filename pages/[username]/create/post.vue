<template>
	<section class="create-post">
		<inner-column>
			<create-block>
				<form @submit.prevent="addPost()" autocomplete="off">
					<div class="create-actions">
						<back-button @click="$router.back()">
							<Icon name="material-symbols:arrow-left-alt" size="30" />
						</back-button>
						<button class="button-filled" type="submit">Add Post</button>
					</div>
					<div @click="openFileInput" class="field add-picture">
						<Icon
							name="material-symbols:perm-media-outline-rounded"
							size="40"
						/>
						<p>Add Thumbnail</p>

						<img
							v-if="postImage.preview"
							:src="postImage.preview"
							alt="image-upload-preview"
							style="width: 200px; height: 200px"
						/>
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

					<div class="field text-content" @click="makeEditable">
						<p
							ref="textbox"
							:class="{ 'editable-class': editable }"
							:contenteditable="editable"
						>
							Example
						</p>
					</div>
				</form>
			</create-block>
		</inner-column>
	</section>
</template>

<script setup>
	//make placeholder text that deletes when p element is editable

	const client = useSupabaseClient();
	const router = useRouter();
	const user = useSupabaseUser();

	const postImage = ref({
		preview: null,
	});
	const fileInput = ref(null);
	const textbox = ref(null);

	const postData = ref({
		header: '',
		content: 'Exmaple',
		image: null,
	});

	const editable = ref(false);
	const makeEditable = () => {
		editable.value = true;

		textbox.value.contentEditable = true;
		textbox.value.focus();
	};
	const makeNormal = () => {
		editable.value = false;
	};

	const openFileInput = () => {
		// trigger click event of file input
		fileInput.value.click();
	};

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
	section.create-post {
		inner-column {
			padding-top: 1rem;
		}

		.editable-class {
			border: 1px solid red;
		}
	}
	back-button {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		border: var(--button-bg) 1px solid;
		border-radius: 999px;
		height: 50px;
		width: 50px;
		&:hover {
			background-color: var(--button-bg);
		}
	}
	create-block {
		display: flex;
		align-items: center;
		width: 100%;
		gap: 40px;

		form {
			display: flex;
			width: 100%;
			flex-direction: column;
			gap: 20px;
		}

		textarea {
			width: 100%;
			font-size: inherit;
			outline: none;
			border: none;
			background-color: transparent;
			z-index: 0;
			color: white;
			resize: none;
			height: 44px;
			// border-bottom: 2px solid red;
			&::placeholder {
				color: rgba(255, 255, 255, 0.4);
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
			min-height: 500px;
			display: flex;
			align-items: stretch;
			p {
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
			color: rgba(255, 255, 255, 0.8);
			p {
				text-transform: uppercase;
				letter-spacing: 0.02em;
				font-weight: 600;
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
			label.active {
				transform: translateY(-120%);
				font-size: 0.8em;
				color: #333;
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

		div.create-actions {
			display: flex;
			width: 100%;
			gap: 40px;

			back-button {
				flex-shrink: 0;
			}
		}
	}
</style>
