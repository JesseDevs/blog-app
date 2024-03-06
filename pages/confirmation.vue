<template>
	<section>
		<inner-column>
			<text-content>
				<p class="level-two-voice">Thank you for creating an account!</p>

				<p class="level-two-voice">Check your email for a confirmation.</p>

				<p class="level-two-voice">Then we can create an Echo.</p>

				<NuxtLink class="user-button" :to="`/`" aria-label="Go to Home">
					Home
				</NuxtLink>
			</text-content>
		</inner-column>

		<WrapFiller class="wrap-container" />
	</section>
</template>

<script setup></script>

<style lang="scss" scoped>
	inner-column {
		margin-bottom: 100px;

		text-content {
			display: flex;
			flex-direction: column;
			gap: 20px;
			p {
				line-height: 1;
				text-align: center;
				font-weight: 200;
				letter-spacing: 0.05em;
				font-style: italic;
				padding-bottom: 1rem;
			}
		}
	}
</style>
