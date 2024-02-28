<template>
	<div class="loading-container">
		<div>
			<text-content>
				<p class="level-two-voice" v-html="text"></p>
			</text-content>
			<Icon name="line-md:loading-twotone-loop" size="100" />
		</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		text: String,
	});
</script>

<style lang="scss" scoped></style>
