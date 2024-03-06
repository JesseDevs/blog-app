<template>
	<modal-content>
		<nav>
			<div class="modal-top">
				<div class="modal-BTNs">
					<NuxtLink :to="`/`" @click="ui.closeMenu" aria-label="Go home">
						Home
					</NuxtLink>
					<NuxtLink
						v-if="!user"
						to="/login"
						@click="ui.closeMenu"
						aria-label="Go to login page"
					>
						Log in
					</NuxtLink>

					<NuxtLink
						v-if="userProfile && user"
						:to="`/${userProfile.username}`"
						@click="ui.closeMenu"
						aria-label="Go to profile"
					>
						Profile
					</NuxtLink>

					<NuxtLink
						v-if="userProfile && user"
						:to="`/${userProfile.username}/Create/Post`"
						@click="ui.closeMenu"
						aria-label="Go to profile"
					>
						Create an Echo
					</NuxtLink>
				</div>
			</div>
			<div class="modal-bottom">
				<div class="modal-BTNs">
					<p v-if="th.themeShowcase" class="show-theme">
						Current Theme:
						<span
							class="glitch"
							data-text="  Glitch"
							v-if="th.selectedTheme == 'glitch'"
						>
						</span>
						<span v-else>{{ th.selectedTheme }}</span>
					</p>
					<button
						class="palette-button"
						@click="th.changePalette"
						aria-label="change palette"
					>
						<Icon
							name="material-symbols:palette"
							size="21"
							color="rgb(var(--white-rgb) / 0.65)"
						/>

						<p
							class="glitch"
							data-text="Change Palette"
							v-if="th.selectedTheme == 'glitch'"
						></p>

						<p v-else>Change Palette</p>
						<p class="index-display">
							({{ th.themeNumber }}/{{ th.colorModes.length }})
						</p>
					</button>
					<button
						v-if="user"
						class="button-filled"
						@click="signOutUser()"
						aria-label="signout user"
					>
						<span>Sign Out</span>
					</button>
				</div>
			</div>
		</nav>
		<ModalFooter />
	</modal-content>
</template>

<script setup>
	import { useInterfaceService } from '~/services/InterfaceService';
	import { useThemeService } from '~/services/ThemeService';
	const ui = useInterfaceService();
	const th = useThemeService();

	const client = useSupabaseClient();
	const router = useRouter();
	const user = useSupabaseUser();

	const colorMode = useColorMode({
		initialValue: 'dark',
	});

	const userProfile = ref(null);

	const signOutUser = async () => {
		try {
			const { error } = await client.auth.signOut();

			if (error) {
				throw error;
			}

			console.log('User signed out successfully');
			userProfile.value = null;
			ui.closeMenu();
			router.push('/');
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
		border-right: var(--thin) solid rgb(var(--outline-color-rgb) / 0.5);

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

	.modal-BTNs {
		padding: 16px;
		display: flex;

		flex-direction: column;
		gap: 16px;
		a {
			border-radius: 3px;
			height: 48px;
			padding: 6px 15px;
			font-weight: 600;
			color: var(--button-text);
			background-color: var(--button-bg);
			box-shadow: var(--button-box) 0 4px 9px;
			justify-content: center;
			align-items: center;
			text-decoration: none;
			display: flex;
			text-transform: capitalize;

			transition: background-color 0.3s ease-in-out;
			&:hover {
				background-color: var(--button-bg-hover);
				box-shadow: var(--button-box-hover) 0 6px 12px;
			}
		}

		.button-filled {
			color: var(--button-text);
			background-color: var(--button-bg);
			box-shadow: var(--button-box) 0 4px 9px;

			width: 100%;
			appearance: none;
			border: none;
			outline: none;

			transition: background-color 0.3s ease-in-out;
			&:hover {
				background-color: var(--button-bg-hover);
				box-shadow: var(--button-box-hover) 0 6px 12px;
			}
		}
	}

	.palette-button {
		padding: 8px 16px;
		border-radius: 3px;
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		background-color: transparent;
		border: none;
		outline: none;
		color: rgba(var(--white-rgb) / 0.65);
		cursor: pointer;
		transition: background-color 0.2s ease;
		p {
			pointer-events: none;
		}

		&:hover {
			background-color: rgba(var(--white-rgb) / 0.09);
		}
	}

	p.index-display {
		text-transform: capitalize;
		margin-left: auto;
		position: relative;
		span {
			position: absolute;
		}
	}

	p.show-theme {
		padding: 0px 1rem;
		span {
			text-transform: capitalize;
		}
	}
</style>
