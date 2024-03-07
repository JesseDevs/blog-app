<template>
	<section>
		<inner-column>
			<reset-page>
				<div>
					<h2 class="level-three-voice">Edit Your Profile</h2>
					<p class="sub-head">
						This is an opportunity to change you name or add some more detail
						to your account.
					</p>
				</div>
				<form @submit.prevent="updateProfile">
					<div class="field">
						<label for="bio">Username</label>
						<input id="bio" disabled v-model="username" />
					</div>
					<div class="field">
						<label for="bio">Full Name</label>
						<input id="bio" v-model="fullName" />
					</div>
					<div class="field">
						<label for="bio">Bio</label>
						<textarea id="bio" v-model="bio" maxlength="150" />
					</div>
					<button type="submit" class="button-filled submit-btn">Save</button>
				</form>
			</reset-page>
		</inner-column>
	</section>
</template>

<script setup></script>

<style lang="scss" scoped>
	edit-page {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 30px;

		.sub-head {
			opacity: 0.75;
		}
	}
</style>
