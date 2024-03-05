<template>
	<card-btns-shown>
		<button @click.prevent="deletePostHandler(postId)" class="delete-btn">
			<span class="small-voice">DELETE</span>
		</button>

		<button @click.prevent="copyLinkHandler" class="share-btn">
			<span class="small-voice">SHARE</span>
		</button>
	</card-btns-shown>
</template>

<script setup>
	const props = defineProps({
		postId: String,
	});

	const { emit } = defineEmits(['delete-post', 'copy-link']);
	const deletePostHandler = () => {
		deletePost(props.postId);
	};

	const copyLinkHandler = () => {
		emit('copy-link');
	};
</script>

<style lang="scss" scoped>
	card-btns-shown {
		display: flex;
		flex-direction: column;
		background-color: var(--background);
		width: 250px;
		position: absolute;
		top: 15px;
		right: 0px;
		z-index: 99;
		height: auto;
		max-height: calc(100% - 22px);
		// inset: 0px auto auto 0px;
		border-radius: 3px;
		box-shadow: 0 0 8px rgb(var(--button-bg-rgb) / 0.5);

		button {
			cursor: pointer;
			border-radius: 3px;
			font-weight: 700;
			border: none;
			margin: 0;
			width: 100%;
			background-color: transparent;
			padding: 10px;
			color: inherit;
			transition: background-color 0.3s ease;
			&:hover {
				background-color: var(--button-bg-hover);
			}
		}

		// 	display: flex;
		// 	align-items: center;
		// 	justify-content: center;
		// 	padding: 8px 16px;
		// 	gap: 8px;
		// 	appearance: none;
		// 	border: none;
		// 	outline: none;
		// 	border: 2px solid var(--text-faded);
		// 	span {
		// 		display: block;
		// 	}
		// }

		// button:first-of-type {
		// 	border-bottom: none;
		// }
	}
</style>
