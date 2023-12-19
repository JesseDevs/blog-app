<template>
	<ClientOnly>
		<Teleport to="site-footer">
			<glass-container
				@click="handleModalContainerClick"
				:class="`${ui.menuClass}`"
			>
				<ModalContent />
			</glass-container>
		</Teleport>
	</ClientOnly>
</template>

<script setup>
	import { useInterfaceService } from '~/services/InterfaceService';
	const ui = useInterfaceService();

	const handleModalContainerClick = (event) => {
		if (!event.target.closest('modal-content')) {
			ui.closeMenu();
		}
	};
</script>

<style lang="scss">
	glass-container {
		height: calc(100% - 46px);
		z-index: 100;
		display: block;
		width: 100%;
		background: var(--color-black-80);
		transition: opacity 0.8s ease;
		position: fixed;

		top: 46px;
		bottom: 0;
		left: 0;
		right: 0;
		transform: translateZ(0);
		backdrop-filter: blur(3px);
		opacity: 0;
		pointer-events: none;
	}

	glass-container.menu-open {
		opacity: 1;
		pointer-events: auto;
		transition: opacity 0.01s ease;
	}
</style>
