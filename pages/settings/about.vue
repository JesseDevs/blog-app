<template>
	<section>
		<inner-column>
			<div>
				<NuxtLink to="/" class="logo">
					<span>E</span>
					<Icon name="arcticons:waves" size="30" />
					<Icon
						class="speaker"
						name="solar:volume-loud-line-duotone"
						size="30"
					/>
				</NuxtLink>
			</div>
		</inner-column>
	</section>
</template>

<script setup></script>

<style lang="scss">
	.animate-drop-in {
		opacity: 0;
		animation: dropIn 0.5s forwards;
		animation-delay: 0.2s;
	}

	@keyframes dropIn {
		from {
			opacity: 0;
			transform: translateY(-46px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	div {
		position: fixed;
		top: 200px;
		left: -50px;
		width: 100%;
		z-index: 20;
		background-color: rgb(var(--background-rgb) / 0.75);
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
			font-size: 28px;
			position: relative;

			svg {
				z-index: -1;
				position: absolute;
				bottom: 0%;
				top: 50%;
				left: calc(50% + 10px);
				transform: translate(-50%, -50%);
				opacity: 0.5;
				stroke: var(--white);
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
			position: relative;

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
				background-color: var(--white);
				transform-origin: 50% center;
				opacity: 1;
				border-radius: var(--thin);
				width: 50%;
				height: 2px;
				transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0s;
				position: absolute;
				top: 50%;
			}
		}
	}
</style>
