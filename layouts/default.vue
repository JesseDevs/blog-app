<template>
	<div class="app-container">
		<SiteNav />
		<div class="space-holder"></div>

		<LazyModalContainer />
		<main>
			<slot />
		</main>
		<SiteFooter />
	</div>
</template>

<script setup>
	import { useInterfaceService } from '~/services/InterfaceService';
	const ui = useInterfaceService();
</script>

<style lang="scss" scoped>
	.app-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;

		main {
			min-height: 100vh;

			section {
				overflow-y: hidden;
			}
		}
	}

	div.space-holder {
		height: 46px;
		width: 100%;
		display: block;
		background-color: var(--background);
	}
</style>
