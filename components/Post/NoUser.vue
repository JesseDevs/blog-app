<template>
	<text-content>
		<p class="level-two-voice">
			What goes around,<br />
			comes around...
		</p>
		<p class="level-two-voice">
			You’re in the wrong spot,<br />
			let’s figure that out...
		</p>

		<a class="user-button" href="/" aria-label="Go to home page"> Home </a>
	</text-content>
</template>

<script setup></script>

<style lang="scss" scoped>
	text-content {
		padding-top: 100px;
		padding-bottom: 100px;
		max-width: 360px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 40px;
		p {
			line-height: 1;
			text-align: center;
			font-weight: 200;
			letter-spacing: 0.05em;
			font-style: italic;
			padding-bottom: 1rem;
		}
	}
</style>
