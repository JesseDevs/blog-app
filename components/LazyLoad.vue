<template>
	<div ref="targetEl">
		<slot v-if="shouldRender" />
	</div>
</template>

<script setup>
	import { useIntersectionObserver } from '@vueuse/core';

	function onIdle(cb = () => {}) {
		if ('requestIdleCallback' in window) {
			window.requestIdleCallback(cb);
		} else {
			setTimeout(() => {
				nextTick(cb);
			}, 300);
		}
	}

	const shouldRender = ref(false);
	const targetEl = ref();
	const { stop } = useIntersectionObserver(
		targetEl,
		([{ isIntersecting }]) => {
			if (isIntersecting) {
				shouldRender.value = true;
				stop();
			}
		},
		{
			rootMargin: '600px',
		},
	);

	if (props.renderOnIdle) {
		onIdle(() => {
			shouldRender.value = true;
			stop();
		});
	}
</script>
