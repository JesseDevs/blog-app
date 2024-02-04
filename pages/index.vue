<template>
	<div>
		<section>
			<inner-column>
				<landing-block>
					<picture>
						<source srcset="images/tilt-1.jpeg" media="(min-width: 701px)" />
						<img src="/images/unsplash-1.jpg" alt="k" />
					</picture>
					<title-block>
						<h1 class="logo level-five-voice">
							<span>The Blog Site</span>
							ECHO
						</h1>
					</title-block>
					<text-content>
						<p class="level-two-voice">
							What goes around,<br />
							comes around...
						</p>
						<a v-if="!user" href="/register" aria-label="Go to login page">
							Log In
						</a>
						<NuxtLink
							v-else
							:to="`/${userProfile?.username}/Create/Post`"
							aria-label="Go to login page"
						>
							Create an Echo
						</NuxtLink>
					</text-content>
				</landing-block>
			</inner-column>
		</section>
		<SpaceFiller />
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
			border-bottom: 1px solid rgb(46 46 46);
			border-top: 1px solid rgb(46 46 46);
			opacity: 0.4;
			overflow-y: hidden;
		}

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
				font-size: initial;
				left: 50%;
				transform: translate(-50%, -50%);
				color: var(--faded-text);
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
