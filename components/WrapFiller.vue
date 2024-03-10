<template>
	<section @click="toggleAnimation" :class="{ 'animation-toggle': animation }">
		<div class="wrap wrap-2">
			<ul>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
			</ul>
		</div>
		<div class="wrap">
			<ul>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
			</ul>
		</div>
	</section>
</template>

<script setup>
	const animation = ref(false);
	const toggleAnimation = () => {
		animation.value = !animation.value;
	};

	// https://codepen.io/srekoble/pen/RwvJRm
	//using
</script>

<style lang="scss" scoped>
	section {
		background: rgb(var(--black-rgb) / 0.5);
		backdrop-filter: blur(4px);
		overflow: hidden;
		background: var(--background);
		height: 250px;
		position: relative;
		// &:hover {
		// 	ul li {
		// 		animation-play-state: paused;
		// 	}
		// }
	}

	section.animation-toggle {
		ul li {
			animation-play-state: paused;
		}
	}
	.wrap {
		top: 50%;
		left: -20%;
		transform: translate(-50%, -50%);
		scale: 1.5;

		position: absolute;
	}

	.wrap-2 {
		display: none;
		opacity: 0;
		transform: scaleX(-1);
		left: auto;
		right: -10%;
	}

	ul {
		transform: rotate3d(0, 1, 0, 45deg);
	}
	ul li {
		list-style: none;
		box-shadow: inset 1px 1px 40px var(--button-bg);
		background: #1c1c1c;
		border-radius: 55%;
		position: absolute;
		top: 50%;
		left: 50%;
	}

	ul li:nth-child(1) {
		border: 1px solid var(--background);
		width: 30px;
		height: 30px;
		z-index: -1;
		margin-top: -15px;
		margin-left: 5px;
		animation: spin 4s 0.2s infinite;
	}

	ul li:nth-child(2) {
		border: 1px solid var(--background);
		width: 60px;
		height: 60px;
		z-index: -2;
		margin-top: -30px;
		margin-left: 10px;
		animation: spin 4s 0.4s infinite;
	}

	ul li:nth-child(3) {
		border: 1px solid var(--background);
		width: 90px;
		height: 90px;
		z-index: -3;
		margin-top: -45px;
		margin-left: 15px;
		animation: spin 4s 0.6s infinite;
	}

	ul li:nth-child(4) {
		border: 1px solid var(--background);
		width: 120px;
		height: 120px;
		z-index: -4;
		margin-top: -60px;
		margin-left: 20px;
		animation: spin 4s 0.8s infinite;
	}

	ul li:nth-child(5) {
		border: 1px solid var(--background);
		width: 150px;
		height: 150px;
		z-index: -5;
		margin-top: -75px;
		margin-left: 25px;
		animation: spin 4s 1s infinite;
	}

	ul li:nth-child(6) {
		border: 1px solid var(--background);
		width: 180px;
		height: 180px;
		z-index: -6;
		margin-top: -90px;
		margin-left: 30px;
		animation: spin 4s 1.2s infinite;
	}

	ul li:nth-child(7) {
		border: 1px solid var(--background);
		width: 210px;
		height: 210px;
		z-index: -7;
		margin-top: -105px;
		margin-left: 35px;
		animation: spin 4s 1.4s infinite;
	}

	ul li:nth-child(8) {
		border: 1px solid var(--background);
		width: 240px;
		height: 240px;
		z-index: -8;
		margin-top: -120px;
		margin-left: 40px;
		animation: spin 4s 1.6s infinite;
	}

	ul li:nth-child(9) {
		border: 1px solid var(--background);
		width: 270px;
		height: 270px;
		z-index: -9;
		margin-top: -135px;
		margin-left: 45px;
		animation: spin 4s 1.8s infinite;
	}

	ul li:nth-child(10) {
		border: 1px solid var(--background);
		width: 300px;
		height: 300px;
		z-index: -10;
		margin-top: -150px;
		margin-left: 50px;
		animation: spin 4s infinite;
	}

	ul li:nth-child(11) {
		border: 1px solid var(--background);
		width: 330px;
		height: 330px;
		z-index: -11;
		margin-top: -165px;
		margin-left: 55px;
		animation: spin 4s 2.2s infinite;
	}

	ul li:nth-child(12) {
		border: 1px solid var(--background);
		width: 360px;
		height: 360px;
		z-index: -12;
		margin-top: -180px;
		margin-left: 60px;
		animation: spin 4s 2.4s infinite;
	}

	@keyframes spin {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(2);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
