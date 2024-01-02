<template>
	<section>
		<space-filler>
			<Icon
				name="streamline:interface-id-voice-1-identification-secure-id-soundwave-sound-voice-security"
				size="50"
				color="var(--button-bg)"
			/>
			<Icon
				name="streamline:interface-id-voice-1-identification-secure-id-soundwave-sound-voice-security"
				size="50"
				color="var(--button-bg)"
			/>
			<Icon
				name="streamline:interface-id-voice-1-identification-secure-id-soundwave-sound-voice-security"
				size="50"
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
			transform: translateX(-100%); // start from left
		}
		to {
			opacity: 1;
			transform: translateX(0); // end at original position
		}
	}
	section {
		background: rgba(46, 46, 46, 0.5);
		backdrop-filter: blur(7px);

		space-filler {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100px;
			overflow-y: hidden;
			filter: blur(7px);
			gap: 15px;
			position: relative;
			&::before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				bottom: 0;
				width: 0;
				background: rgba(var(--button-bg-rgb) / 0.3);
				transition: width 0.5s ease-in-out, left 0.5s ease-in-out; // Smooth transition effect
				z-index: -1; // Place it behind the icons
			}

			&:hover::before {
				width: 100%;
				left: auto;
				right: 0;
			}

			&:not(:hover)::before {
				width: 0;
				left: 0;
				right: auto;
			}
			svg {
				height: auto;
				width: 150px;
				opacity: 0.4;
			}
		}
	}
</style>
