<template>
	<div class="loading-container">
		<div>
			<text-content>
				<p class="level-two-voice" v-html="text"></p>
			</text-content>
			<Icon name="svg-spinners:bars-scale-middle" size="100" />
		</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		text: String,
	});
</script>

<style lang="scss"></style>
