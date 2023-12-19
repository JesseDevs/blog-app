<template>
	<section class="login">
		<inner-column>
			<create-block>
				<form @submit.prevent="addPost()" autocomplete="off">
					<div class="field header level-three-voice">
						<input
							v-model="postData.header"
							placeholder="Enter title..."
							type="text"
							id="postHeading"
							required
							@focus="handleFocus"
							@blur="handleBlur"
						/>
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

	const postData = ref({
		header: '',
		content: 'This is the content of the post.',
	});

	const addPost = async () => {
		try {
			const { data, error } = await supabase.from('posts').insert([
				{
					user_id: user.value.id,
					header: postData.header,
					content: postData.content,
					date_created: new Date().toISOString().split('T')[0],
					time_created: new Date().toISOString().split('T')[1].split('.')[0],
					likes: [], // Assuming you want an empty array for likes by default
				},
			]);

			if (error) {
				console.error('Error inserting data:', error);
			} else {
				console.log('Data inserted successfully:', data);
			}
		} catch (error) {
			console.error('Error:', error.message);
		}
	};

	// const isFocused = ref(false);

	// const handleFocus = () => {
	// 	isFocused.value = true;
	// };

	// const handleBlur = () => {
	// 	isFocused.value = false;
	// };
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
		}

		div.header {
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
			input {
				width: 100%;
				font-size: inherit;
				outline: none;
				border: none;
				background-color: transparent;
				z-index: 0;
				color: white;
				&::placeholder {
					color: rgba(255, 255, 255, 0.647);
				}
			}
		}
	}
</style>
