<template>
	<header :class="` ${ui.menuClass} main-tool-bar site-header`">
		<inner-column>
			<nav class="main-menu">
				<button
					class="hamburger-button icon-button"
					@click="ui.toggleMainMenu"
					aria-label="open-menu"
				>
					<div class="mbykw">
						<span></span>
						<span></span>
						<span></span>
					</div>
				</button>

				<NuxtLink to="/" class="logo" @click="ui.closeMenu">
					E
					<Icon name="arcticons:waves" size="30" color="white" />
					<Icon
						class="speaker"
						name="solar:volume-loud-line-duotone"
						size="30"
						color="white"
					/>
				</NuxtLink>

				<div class="placeholder"></div>
			</nav>
		</inner-column>
	</header>
</template>

<script setup>
	import { useInterfaceService } from '~/services/InterfaceService';
	const ui = useInterfaceService();
</script>

<style lang="scss">
	header {
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 20;
		background-color: rgba(4, 5, 6, 0.75);
		backdrop-filter: blur(6px);

		inner-column {
			padding: 3px 0.5rem;

			.main-menu {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
			}
		}

		.logo {
			width: 40px;
			height: 40px;
			line-height: 1.2;
			text-align: center;
			font-size: var(--size-xl);
			position: relative;

			svg {
				position: absolute;
				bottom: 0%;
				top: 50%;
				left: calc(50% + 10px);
				transform: translate(-50%, -50%);
				opacity: 0.5;
			}

			svg:not(.speaker) {
				stroke-width: 3px;
			}
			.speaker {
				left: calc(50% + 20px);
			}
			.speaker path:first-of-type {
				display: none;
			}
		}

		div.placeholder {
			width: 40px;
		}

		.hamburger-button {
			color: inherit;
			cursor: pointer;

			user-select: none;
			background-color: transparent;
			border: none;
			margin: 0;
			padding: 0;
			width: 40px;
			height: 40px;

			div.mbykw {
				opacity: 0.65;
				justify-content: center;
				align-items: center;
				width: 40px;
				height: 40px;
				margin-left: 0px;
				transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0s;
				display: flex;
				position: relative;

				span:first-child {
					transform: translateY(-6px);
				}
				span:nth-child(3) {
					transform: translateY(6px);
				}
			}

			span {
				background: white;
				transform-origin: 50% center;
				opacity: 1;
				border-radius: 1px;
				width: 50%;
				height: 2px;
				transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0s;
				position: absolute;
				top: 50%;
			}
		}
	}

	header.menu-open {
		div.mbykw {
			opacity: 1;
			span:first-child {
				transform: rotate(45deg);
			}
			span:nth-child(2) {
				opacity: 0;
			}
			span:nth-child(3) {
				transform: rotate(-45deg);
			}
		}
	}
</style>
