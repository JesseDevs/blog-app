<template>
	<div>
		<section>
			<inner-column>
				<landing-block>
					<picture>
						<!-- <source srcset="/tilt-1.jpeg" media="(min-width: 701px)" /> -->
						<img src="/images/unsplash-1.webp" alt="Home wave image" />
					</picture>
					<title-block class="animate-scale-out">
						<h1 class="logo level-five-voice">
							<span class="level-one-voice">The Blog Site</span>
							ECHO
						</h1>
					</title-block>
					<text-content class="animate-fade-in">
						<p class="level-two-voice">
							What goes around,<br />
							comes around...
						</p>

						<NuxtLink
							class="user-button animate-fade-in"
							v-if="user"
							:to="`/${currentUser?.username}/Create/Post`"
							aria-label="Go to create post page"
						>
							Create an Echo
						</NuxtLink>
						<NuxtLink
							class="user-button"
							v-else
							to="/login"
							aria-label="Go to login page"
						>
							Login
						</NuxtLink>

						<p v-show="postEmpty" class="custom-link" @click="scrollDown">
							Explore
						</p>
					</text-content>
				</landing-block>
			</inner-column>
		</section>
		<WrapFiller class="animate-fade-in" />
		<ExploreCards @empty-posts="handleEmptyPosts" />
	</div>
</template>

<script setup>
	const client = useSupabaseClient();
	const router = useRouter();
	const user = useSupabaseUser();
	const currentUser = ref(null);

	const scrollDown = () => {
		window.scrollBy(0, 500);
	};

	const postEmpty = ref(null);
	const handleEmptyPosts = () => {
		postEmpty.value = false;
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
				currentUser.value = data;
			}
		}
	});
</script>

<style lang="scss" scoped>
	.animate-fade-in {
		opacity: 0;
		animation: fadeIn 0.5s forwards;
		animation-delay: 0.5s;
	}

	section + .animate-fade-in {
		animation-delay: 0.8s;
	}

	.animate-scale-out {
		opacity: 0;
		transform: scale(2);
		animation: scaleOut 0.3s forwards;
		animation-delay: 0.2s;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes scaleOut {
		from {
			opacity: 0;
			transform: scale(1.7);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
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

			overflow-y: hidden;
			background-color: var(--background);
			opacity: 0.8;
			* {
				opacity: 0.3;
			}

			@media (min-width: 1400px) {
				opacity: 0.4 !important;
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
			cursor: pointer;

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
				font-weight: 300;
				position: absolute;
				top: -12px;

				left: 50%;
				transform: translate(-50%, -50%);
				color: rgb(var(--white-rgb) / 0.85);
			}
			h1 {
				text-transform: initial;
				position: relative;
				width: 100%;
				text-align: center;
			}
		}
	}
</style>
