<template>
	<modal-content>
		<nav>
			<div class="modal-top">
				<div class="modal-BTNs">
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
					<button
						class="palette-button"
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
	const ui = useInterfaceService();

	const client = useSupabaseClient();
	const router = useRouter();
	const user = useSupabaseUser();

	const userProfile = ref(null);
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
			justify-content: center;
			align-items: center;
			text-decoration: none;
			display: flex;
		}

		.button-filled {
			color: var(--button-text);
			background-color: var(--button-bg);

			width: 100%;
			appearance: none;
			border: none;
			outline: none;
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
		color: rgba(var(--white-on-dark), 0.65);
		cursor: pointer;
		transition: background-color 0.2s ease;

		&:hover {
			background-color: rgba(var(--white-on-dark), 0.07);
		}
	}
</style>
