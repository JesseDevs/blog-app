<template>
	<section>
		<space-filler>
			<Icon
				name="streamline:interface-id-voice-1-identification-secure-id-soundwave-sound-voice-security"
				color="var(--button-bg)"
			/>
			<Icon
				name="streamline:interface-id-voice-1-identification-secure-id-soundwave-sound-voice-security"
				color="var(--button-bg)"
			/>
			<Icon
				name="streamline:interface-id-voice-1-identification-secure-id-soundwave-sound-voice-security"
				color="var(--button-bg)"
			/>
		</space-filler>
	</section>
</template>

<script setup></script>

<style lang="scss" scoped>
	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateX(-100%);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
	section {
		background: rgba(46, 46, 46, 0.5);
		backdrop-filter: blur(4px);
		overflow: hidden;
		background: rgb(3, 4, 5);
		// background: linear-gradient(
		// 	0deg,
		// 	rgba(3, 4, 5, 1) 0%,
		// 	rgba(3, 4, 5, 0) 50%,
		// 	rgba(3, 4, 5, 1) 100%
		// );

		space-filler {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100px;
			overflow-y: hidden;
			filter: blur(7px);
			opacity: 0.8;
			gap: 15px;
			position: relative;

			background: rgb(3, 4, 5);
			background: linear-gradient(
				0deg,
				rgba(3, 4, 5, 1) 0%,
				rgba(3, 4, 5, 0) 50%,
				rgba(3, 4, 5, 1) 100%
			);
			&::before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				bottom: 0;
				width: 0;
				background: rgba(var(--button-bg-rgb) / 0.3);
				transition: width 0.5s ease-in-out, left 0.5s ease-in-out;
				z-index: -1;
			}

			&:hover::before {
				width: 100%;
				left: auto;
				right: 0;
				transition: width 0.5s ease-in-out, left 0.5s ease-in-out;
			}

			&:not(:hover)::before {
				width: 0;
				left: 0;
				right: auto;
				transition: width 0.5s ease-in-out, left 0.5s ease-in-out;
			}
			svg {
				height: auto;
				width: 150px;
				opacity: 0.6;
				filter: blur(6px);
			}
		}
	}
</style>
