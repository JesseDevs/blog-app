<template>
	<section>
		<profile-dashboard v-if="userProfile">
			<inner-container>
				<NuxtLink
					to="edit/profile"
					aria-label="edit profile"
					class="outline-button"
					>Edit Profile</NuxtLink
				>
				<h2 class="level-two-voice full-name">
					{{ userProfile.full_name }}
				</h2>
				<p class="username">@{{ userProfile.username }}</p>
				<details-box>
					<p>
						<Icon name="clarity:calendar-line" /> Joined
						{{ formattedDate }}
					</p>
				</details-box>
			</inner-container>

			<dashboard-menu>
				<nav>
					<div>
						<p>Posts</p>
						<span></span>
					</div>
				</nav>
			</dashboard-menu>
		</profile-dashboard>
		<ul>
			<li>
				<post-card>
					<h3 class="level-one-voice">Title</h3>

					<p>
						Content Preview- Lorem ipsum dolor sit amet, consectetur
						adipiscing elit, sed do eiusmod tempor incididunt ut labore et
						dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
						exercitation ullamco laboris nisi ut aliquip ex ea commodo
						consequat. Duis aute irure dolor in reprehenderit in
					</p>
					<div class="blurred"></div>
				</post-card>
			</li>
		</ul>
	</section>
</template>

<script setup>
	const loading = ref(true);
	setTimeout(() => {
		loading.value = false;
	}, 1000);

	const router = useRouter();
	const client = useSupabaseClient();
	const user = useSupabaseUser();

	const userProfile = ref(null);
	const formattedDate = ref('');
	const formatDate = () => {
		if (user.value && user.value.identities && user.value.identities.length > 0) {
			const created_at_timestamp = user.value.identities[0].created_at;
			const created_at_datetime = new Date(created_at_timestamp);
			const options = { year: 'numeric', month: 'long' };
			formattedDate.value = created_at_datetime.toLocaleDateString(
				'en-US',
				options,
			);
		} else {
			console.error(
				'No identity found or missing created_at property in identities array.',
			);
		}
	};
	formatDate();

	// Fetch user data for 'profiles' table in supabase based on user id
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
	section {
		height: 100vh;

		.loading-container {
			display: grid;
			place-items: center;
			min-height: 40vh;
			margin-bottom: 40vh;
		}
	}

	details-box {
		display: flex;
		flex-direction: column;
		width: 100%;
		color: var(--faded-text);
		padding-top: 10px;
		p {
			display: flex;
			align-items: center;
			gap: 5px;
		}
	}

	.content-container {
		overflow: hidden;
		position: relative;

		&.blurred {
			filter: blur(5px); // Adjust the blur amount as needed
			color: transparent;
			text-shadow: 0 0 5px rgba(0, 0, 0, 0.5); // Add text shadow to make it visible
		}
	}

	dashboard-menu {
		display: block;
		width: 100%;
		margin-top: 2rem;

		nav {
			display: flex;
			border-bottom: 1px solid var(--faded-text);

			div {
				padding: 0px 16px;
				position: relative;
				transition: background-color 0.2s ease-in-out;
				&:hover {
					background-color: rgb(37, 36, 36);
				}
				p {
					display: inline-block;
					padding: 16px 0px;
				}
				span {
					position: absolute;
					height: 4px;
					border-radius: 999px;
					background-color: var(--button-bg);

					bottom: -1.5px;
					left: 50%;
					transform: translateX(-50%);
					width: 85%;
				}
			}
		}
	}

	inner-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: flex-start;
		padding: 4rem 1.5rem;
		padding-bottom: 0;
	}

	profile-dashboard {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: flex-start;

		.outline-button {
			align-self: flex-end;
			margin-bottom: 1rem;
			&:hover {
				background-color: rgb(37, 36, 36);
			}
		}
		.full-name {
			font-family: 'Roboto Slab', serif;
			font-weight: 600;
		}
		.username {
			color: var(--faded-text);
			font-family: 'Roboto Slab', serif;
		}
	}

	ul {
		li {
			padding: 1.5rem;
			border-bottom: 1px solid var(--faded-text);
		}
	}

	post-card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 5px;
		width: 100%;
		position: relative;

		h3 {
			font-weight: 700;
			font-style: italic;
		}

		p {
			max-height: 120px;
			overflow-y: hidden;
		}
		.blurred {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100px;
			background: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4));
		}
	}
</style>
