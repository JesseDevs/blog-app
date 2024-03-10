<template>
	<error-box v-if="error">
		<text-content>
			<p class="level-two-voice">{{ error.message }}</p>
		</text-content>
		<Icon name="svg-spinners:bars-scale-middle" size="100" />
		<button class="close-btn" @click="toggleResetBlock">
			<Icon name="carbon:close" size="21" />
		</button>
	</error-box>
</template>

<script setup>
	const props = defineProps({
		error: Object,
	});
</script>

<style lang="scss">
	.close-btn {
		cursor: pointer;
		border-radius: 3px;
		font-weight: 700;
		border: none;
		padding: 4px;
		margin-left: auto;
		margin-bottom: 30px;
		appearance: none;
		background-color: var(--button-bg);
		transition: background-color 0.3s ease-in-out;
		&:hover {
			background-color: var(--button-bg-hover);
		}

		svg {
			stroke-width: 4px !important;
			color: var(--white);
		}
	}

	.loading-container {
		background-color: var(--background);
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;

		height: 100%;

		div {
			display: grid;
			padding-top: 70px;
			place-items: center;
			min-height: 40vh;
			margin-bottom: 20vh;
		}

		text-content {
			padding-top: 100px;
			padding-bottom: 100px;
			max-width: 360px;
			margin: 0 auto;

			p {
				line-height: 1;
				text-align: center;
				font-weight: 200;
				letter-spacing: 0.05em;
				font-style: italic;
				padding-bottom: 1rem;
			}
		}
	}
</style>
