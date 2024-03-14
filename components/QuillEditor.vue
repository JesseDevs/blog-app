<template>
	<QuillEditor :options="options" content-type="html" />
</template>

<script setup>
	import { QuillEditor } from '@vueup/vue-quill';
	import 'quill/dist/quill.snow.css';

	const toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'],
		['blockquote', 'link'],

		[{ list: 'ordered' }, { list: 'bullet' }],
		// [{ indent: '-1' }, { indent: '+1' }],

		[{ align: [] }],
		[], // text direction
		[], // text direction
		['clean'], // remove formatting button
	];

	const options = ref({
		modules: {
			toolbar: toolbarOptions,
		},
		placeholder: 'Start your journal post...',
	});
</script>

<style lang="scss"></style>
