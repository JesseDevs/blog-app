<template>
	<modal-content>
		<nav>
			<div class="modal-top">
				<NuxtLink to="/signin" @click="ui.closeMenu"> Log in </NuxtLink>
				<button
					class="simple-button"
					@click="ui.toggleMainMenu"
					aria-label="change palette"
				>
					<Icon
						name="material-symbols:palette"
						size="21"
						color="rgba(var(--white-on-dark), 0.65)"
					/>

					<p>Change palette</p>
				</button>
			</div>
			<div v-if="user">{{ user.email }}</div>
			<div class="modal-footer">
				<a class="small-voice" href="/guide/about"> About</a>
				<a class="small-voice" href="/guide/terms">Terms of Service</a>
				<a class="small-voice" href="/guide/privacy"> Privacy</a>
			</div>
		</nav>
	</modal-content>
</template>

<script setup>
	import { useInterfaceService } from '~/services/InterfaceService';
	const ui = useInterfaceService();

	const client = useSupabaseClient();
	const router = useRouter();
	const user = useSupabaseUser();
</script>

<style lang="scss" scoped>
	modal-content {
		background-color: var(--background);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 90vw;
		max-width: 360px;
		height: 100%;

		overflow: hidden;
		border-right: 1px solid rgba(255, 255, 255, 0.137);

		transition: left 0.2s ease;
		position: absolute;
		top: 0%;
		bottom: 0;
		right: 0;
		left: -100%;
		nav {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 100%;
			display: flex;
			overflow-x: hidden;
			overflow-y: auto;
		}
	}

	glass-container.menu-open {
		modal-content {
			left: 0;
		}
	}

	.modal-top {
		a {
			border-radius: 3px;
			margin: 16px;
			height: 48px;
			padding: 6px 15px;
			font-weight: 600;
			color: var(--button-text);
			background-color: var(--button-bg);
			justify-content: center;
			align-items: center;
			text-decoration: none;
			display: flex;
		}

		button {
			padding: 8px 16px;
			display: flex;
			align-items: center;
			gap: 8px;
			width: 100%;
			background-color: transparent;
			border: none;
			outline: none;
			color: rgba(var(--white-on-dark), 0.65);
			cursor: pointer;

			&:hover {
				background-color: rgba(var(--white-on-dark), 0.07);
			}
		}
	}

	.modal-footer {
		padding: 1rem 1rem;
		flex-wrap: wrap;
		line-height: 1.52;
		display: flex;

		a {
			padding: 0px 10px;
		}
	}
</style>
