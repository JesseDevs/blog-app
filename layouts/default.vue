<template>
	<div class="app-container">
		<!-- <transition name="fade" appear> </transition>
		<div class="ripple-container" v-if="initialLoad">
			<button></button>
			<button></button>
			<button></button>
			<button></button>
			<button></button>
		</div> -->

		<SiteNav />
		<ModalBig class="mid-size-display" />
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

	const showInitialLoad = ref(true);
	const expirationTime = 24 * 60 * 60 * 1000; //  1 day in milliseconds
	// const initialLoad = true;
	// const contentLoaded = ref(false);

	// const closeInitialLoad = () => {
	// 	initialLoad.value = false;

	// };

	onMounted(() => {});
</script>

<style lang="scss" scoped>
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.3s ease-in-out, filter 0.5s ease-in-out;
	}
	.fade-enter,
	.fade-leave-to {
		opacity: 0;
		filter: blur(10px);
	}

	.app-container {
		--big-view-size: 68px;
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

	.mid-size-display {
		display: none;
	}

	@media (min-width: 600px) {
		.app-container {
			padding-left: var(--big-view-size);
		}
		.mid-size-display {
			display: flex;
		}
	}

	@media (min-width: 850px) {
		.app-container {
			--big-view-size: 250px;
		}
	}

	div.space-holder {
		height: 46px;
		width: 100%;
		display: block;
		background-color: var(--background);
	}

	@keyframes ripple {
		0% {
			width: 100px;
			height: 100px;
			opacity: 1;
		}
		100% {
			width: 800px;
			height: 800px;
			opacity: 0;
		}
	}

	.ripple-container {
		//https://codepen.io/antoniolee/pen/ZEGRwdp
		display: flex;
		height: 100vh;
		width: 100%;
		align-items: center;
		justify-content: center;
		background-color: black;
		background-image: linear-gradient(
				to bottom,
				rgba(0, 0, 0, 0.3),
				rgba(0, 0, 0, 0.3)
			),
			url('/images/sound-texture.jpg');
		background-size: 100% auto;
		background-position: center;
		background-repeat: no-repeat;

		button {
			position: absolute;
			animation: ripple 5s ease 1s infinite forwards;
			border-radius: 50%;
			border: none;
			background-color: rgb(13 15 15 / 0.5);
			box-shadow: inset 10px 10px 20px rgb(var(--button-bg-rgb) / 0.7),
				inset -10px -10px 20px rgb(var(--button-bg-rgb) / 0.7);
			transition: 0.33s ease-in all;
			opacity: 0;
		}

		button:nth-child(1) {
			animation-delay: 750ms;
		}

		button:nth-child(2) {
			animation-delay: 1250ms;
		}

		button:nth-child(3) {
			animation-delay: 1750ms;
		}

		button:nth-child(4) {
			animation-delay: 2150ms;
		}

		button:nth-child(5) {
			animation-delay: 2750ms;
		}
	}
</style>
