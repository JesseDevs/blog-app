<template>
	<div>
		<section>
			<inner-column>
				<landing-block>
					<picture>
						<source srcset="/tilt-1.jpeg" media="(min-width: 701px)" />
						<img src="/images/unsplash-1.jpg" alt="Home wave image" />
					</picture>
					<title-block>
						<h1 class="logo level-five-voice">
							<span class="level-one-voice">The Blog Site</span>
							ECHO
						</h1>
					</title-block>
					<text-content>
						<p class="level-two-voice">
							What goes around,<br />
							comes around...
						</p>

						<a
							class="user-button"
							v-if="!user"
							href="/register"
							aria-label="Go to register page"
						>
							Sign Up
						</a>
						<NuxtLink
							class="user-button"
							v-else
							:to="`/${userProfile?.username}/Create/Post`"
							aria-label="Go to login page"
						>
							Create an Echo
						</NuxtLink>

						<a class="custom-link" href="#explore-cards">Explore</a>
					</text-content>
				</landing-block>
			</inner-column>
		</section>
		<WrapFiller />

		<ExploreCards />
	</div>
</template>

<script setup>
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
</script>

<style lang="scss" scoped>
	landing-block {
		display: flex;
		width: 100%;
		flex-direction: column;
		padding-top: 50px;
		padding-bottom: 50px;
		picture {
			position: absolute;
			z-index: -100;
			left: 0;
			top: 0;
			border-top: var(--thin) solid var(--box-shadow);
			overflow-y: hidden;
			background-color: var(--background);
			opacity: 0.8;
			img {
				opacity: 0.5;
			}
		}

		.custom-link {
			font-size: inherit;
			position: relative;
			display: inline-block;
			transition: color 0.4s ease;
			padding: 8px 16px;
			margin: 1rem auto 0;
			width: fit-content;
			height: fit-content;

			letter-spacing: 0.8px;
			font-weight: 500;
			text-decoration: underline;
			text-transform: uppercase;

			line-height: 1;
			text-align: center;
			font-weight: 300;

			font-style: italic;

			&:hover {
				color: var(--white);
				text-decoration: none;
			}
		}

		.custom-link::before {
			content: '';
			position: absolute;
			border-radius: 3px;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 0%;
			background-color: var(--button-bg);
			transition: height 0.3s ease;
			// transition-delay: 0.1s;
			z-index: -1;
		}

		.custom-link:hover::before {
			height: 100%;
		}

		text-content {
			padding-top: 100px;
			padding-bottom: 100px;
			max-width: 360px;
			margin: 0 auto;
			p {
				line-height: 1;
				text-align: center;
				font-weight: 200;
				letter-spacing: 0.05em;
				font-style: italic;
				padding-bottom: 1rem;
			}
		}

		title-block {
			display: flex;
			width: 100%;
			align-items: flex-end;
			position: relative;

			.dash {
				align-self: center;
				margin-top: 15px;
			}
			span {
				padding-bottom: 5px;
				font-weight: 200;
				position: absolute;
				top: -12px;

				left: 50%;
				transform: translate(-50%, -50%);
				color: var(--text-faded);
			}
			h1 {
				text-transform: initial;
				position: relative;
				width: 100%;
				text-align: center;
			}
		}
	}

	body {
		background: #1c1c1c;
	}
</style>
