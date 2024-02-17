<template>
	<div class="success-message" v-if="success">Data inserted successfully!</div>
</template>

<script setup>
	const props = defineProps({
		success: Boolean,
	});
</script>

<style lang="scss" scoped>
	.success-message {
		background-color: #dff0d8;
		border: 1px solid #c3e6cb;
		color: #155724;
		padding: 10px;
		margin-bottom: 10px;
	}
</style>
