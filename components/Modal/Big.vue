<template>
	<big-view :class="` ${ui.footerClass} `">
		<nav>
			<modal-actions>
				<NuxtLink :to="`/`" aria-label="Go home">
					<div>
						<span class="icon-holder">
							<Icon name="material-symbols:home" />
						</span>
						<p class="only-850plus">Home</p>
					</div>
				</NuxtLink>

				<NuxtLink v-if="!user" to="/login" aria-label="Go to login page">
					<div>
						<span class="icon-holder">
							<Icon name="ph:user-circle-plus" class="your-icon-class" />
						</span>
						<p class="only-850plus">Login</p>
					</div>
				</NuxtLink>

				<NuxtLink
					v-if="userProfile && user"
					:to="`/${userProfile.username}`"
					aria-label="Go to profile"
				>
					<div>
						<span class="icon-holder">
							<Icon name="ic:baseline-person" size="30" />
						</span>
						<p class="only-850plus">Profile</p>
					</div>
				</NuxtLink>

				<NuxtLink
					v-if="userProfile && user"
					:to="`/${userProfile.username}/Create/Post`"
					aria-label="Go to create post"
					class="attention-button"
				>
					<div>
						<span class="icon-holder">
							<Icon
								class="your-special-icon"
								name="material-symbols:add-circle-outline-rounded"
								size="30"
							/>
						</span>
						<p class="only-850plus">Create An Echo</p>
					</div>
				</NuxtLink>
			</modal-actions>

			<div class="modal-bottom">
				<modal-actions>
					<Transition name="theme" mode="out-in">
						<div v-if="th.themeShowcase" class="themeshowcase">
							<p class="show-theme vertical-text">
								Theme:
								<span
									class="glitch"
									data-text="  Glitch"
									v-if="th.selectedTheme == 'glitch'"
								>
								</span>
								<span v-else>{{ th.selectedTheme }}</span>
							</p>
							<p>({{ th.themeNumber }}/{{ th.colorModes.length }})</p>
						</div>
					</Transition>

					<button @click="th.changePalette" aria-label="change palette">
						<div>
							<span class="icon-holder">
								<Icon
									name="material-symbols:palette"
									class="your-special-icon"
								/>
							</span>
							<p class="only-850plus">Change Palette</p>
						</div>
					</button>

					<button v-if="user" @click="signOutUser()" aria-label="signout user">
						<div>
							<span class="icon-holder">
								<Icon
									name="lets-icons:sign-out-squre"
									class="your-icon-class"
								/>
							</span>
							<p class="only-850plus">Sign Out</p>
						</div>
					</button>
					<button
						@click="ui.toggleFooterMenu"
						class="hamburger-button icon-button not-850"
						aria-label="open-footer"
					>
						<div class="mbykw">
							<span></span>
							<span></span>
							<span></span>
						</div>
					</button>
				</modal-actions>
			</div>
		</nav>

		<div class="modal-footer">
			<!-- <a class="small-voice" href="/settings/about"> About</a> -->
			<NuxtLink class="small-voice" to="/settings/terms">Terms of Service</NuxtLink>
			<NuxtLink class="small-voice" to="/settings/privacy"> Privacy</NuxtLink>
			<NuxtLink
				class="small-voice"
				external
				to="https://jessedevs.net/"
				target="_blank"
			>
				JesseDevs</NuxtLink
			>
			<NuxtLink
				class="small-voice"
				target="_blank"
				external
				to="https://www.instagram.com/jessedude2/"
			>
				Who is Jesse?</NuxtLink
			>
		</div>
	</big-view>
</template>

<script setup>
	import { useInterfaceService } from '~/services/InterfaceService';
	import { useThemeService } from '~/services/ThemeService';
	const ui = useInterfaceService();
	const th = useThemeService();

	const client = useSupabaseClient();
	const router = useRouter();
	const user = useSupabaseUser();

	const userProfile = ref(null);

	const signOutUser = async () => {
		try {
			const { error } = await client.auth.signOut();

			if (error) {
				throw error;
			}

			console.log('User signed out successfully');
			userProfile.value = null;

			router.push('/');
			// location.reload();
			setTimeout(() => {
				location.reload();
			}, 0);
		} catch (error) {
			console.error('Error signing out user:', error.message);
		}
	};

	onMounted(async () => {
		if (user.value) {
			const { data, error } = await client
				.from('profiles')
				.select()
				.eq('id', user.value.id)
				.single();

			if (error) {
				console.error('Error fetching user profile:', error.message);
			} else {
				userProfile.value = data;
			}
		}
	});
</script>

<style lang="scss">
	.theme-enter-active,
	.theme-leave-active {
		transition: opacity 0.3s ease-in-out, filter 0.5s ease-in-out;
	}

	.theme-enter,
	.theme-leave-to {
		opacity: 0;
		filter: blur(10px);
	}

	.hamburger-button {
		color: inherit;
		cursor: pointer;
		display: flex;
		align-items: center;
		user-select: none;
		background-color: transparent;
		border: none;
		margin: 0;
		padding: 0;
		width: 40px;
		height: 40px;
		position: relative;
		margin: 0 auto;
		border-radius: 50%;
		border: 1px solid var(--button-bg);
		z-index: 1;

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

	big-view.footer-open {
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

		.modal-footer {
			bottom: 0;
		}
	}

	.only-850plus {
		display: none;
	}

	big-view {
		display: flex;
		position: relative;
		flex-direction: column;
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;

		z-index: 999;

		width: var(--big-view-size);

		border-right: 0.6px solid rgb(var(--outline-color-rgb) / 0.5);
		padding-top: 70px;
		padding-bottom: 20px;
		padding-left: 5px;
		padding-right: 5px;

		.modal-footer {
			position: absolute;
			bottom: 0;
			left: var(--big-view-size);
			height: 62px;
			width: 100vw;
			padding: 1rem;

			background-color: rgb(var(--background-rgb) / 0.85);
			bottom: -62px;
			transition: bottom 0.3s ease;
			display: flex;
			align-items: center;
			margin-top: 10px;
			a {
				padding: 10px;
			}
		}

		nav {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
			height: 100%;
		}

		modal-actions {
			display: flex;
			width: 100%;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: 5px;

			.themeshowcase {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				gap: 18px;

				p {
					font-weight: 300;
					font-size: 17px;
					display: flex;
					gap: 10px;

					span {
						margin-left: auto;
						display: block;
					}
				}
			}

			div {
				display: flex;

				border-radius: 3px;
				align-items: center;
				justify-content: center;
				width: 100%;
				p {
					font-weight: 600;
					font-size: 19px;
				}
			}

			a,
			button,
			span.icon-holder {
				padding: 10px;
				max-width: 50.25px;
				max-height: 50.25px;
				display: flex;
				align-items: center;
				flex-basis: auto;
				flex-shrink: 0;
				position: relative;
				border-radius: 3px;
				background-color: transparent;
				transition: background-color 0.3s ease;
				appearance: none;
				outline: none;
				border: none;

				overflow: hidden;
				cursor: pointer;
			}

			a,
			button {
				background-color: var(--background);
				&:hover {
					background-color: rgb(var(--white-rgb) / 0.1);
				}
			}

			svg {
				transition: color 0.3s ease, stroke-width 0.3s ease;
				user-select: none;
				width: 11.75rem;
				height: 4.75rem;
				max-width: 100%;

				display: inline-block;
				stroke-width: 2px;
				border-radius: 3px;
				stroke: var(--text);
				color: transparent;

				path + path {
					transition: color 0.3s ease, stroke-width 0.3s ease;
					stroke-width: 2px;
				}
			}

			.your-icon-class {
				stroke-width: 1px;
				color: var(--text);
			}
			.your-special-icon {
				stroke-width: 0;
				color: var(--text);
			}
		}
	}

	div.modal-bottom {
		width: 100%;
	}

	.vertical-text {
		writing-mode: vertical-rl;
		white-space: nowrap;
		transform: rotate(180deg);

		padding: 0 !important;
	}

	@media (min-width: 850px) {
		.not-850 {
			display: none;
		}
		.only-850plus {
			display: block;
		}

		nav {
			align-items: flex-start;
			padding-left: 8px;
			padding-right: 8px;
			modal-actions {
				align-items: flex-start;
				gap: 10px;

				a,
				button {
					width: 100%;
					max-width: none;
					color: var(--text);
					&:hover {
						background-color: rgb(var(--white-rgb) / 0.1);
					}

					svg {
						max-width: 50.25px;
						max-height: 50.25px;
					}
					p {
						color: inherit !important;
					}
				}

				span.icon-holder {
					&:hover {
						background-color: inherit;
					}
				}

				div {
					width: 100%;
					border-radius: 3px;

					transition: background-color 0.3s ease;
					justify-content: flex-start;
					overflow: hidden;
				}

				.attention-button {
					background-color: var(--button-bg);
					box-shadow: 0 0 12px rgb(var(--button-bg-rgb) / 0.5);
					border: 1px solid rgb(var(--button-bg-rgb) / 0.5);
					transition: background-color 0.3s ease-in-out,
						box-shadow 0.3s ease-in-out;
					color: var(--button-text);

					div {
						justify-content: center;
					}
					span.icon-holder {
						display: none;
					}

					&:hover {
						background-color: var(--button-bg-hover);
						&:hover {
							background-color: var(--button-bg-hover);
							box-shadow: var(--button-box-hover) 0 6px 12px;
						}
					}
				}

				.themeshowcase {
					padding-left: 22px;
					padding-right: 8px;
					p {
						width: 100%;
						span {
							margin-left: 0;
						}
					}
				}
			}
		}

		big-view .modal-footer {
			position: static;
			flex-wrap: wrap;
			height: auto;
			width: auto;
			column-gap: 5px;
			padding-bottom: 0;
			background-color: transparent;
			a {
				padding: 5px;
			}
		}

		.vertical-text {
			writing-mode: horizontal-tb;
			white-space: nowrap;
			transform: rotate(0);

			padding: 0 !important;
		}
	}
</style>
