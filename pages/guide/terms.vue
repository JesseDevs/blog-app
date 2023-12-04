<template>
	<section>
		<inner-column>
			<text-module>
				<div>
					<h1 class="level-five-voice">Terms of Service</h1>
				</div>
				<div>
					<p>
						Welcome to
						<span class="logo">E</span>cho: The Blog Site.
					</p>
					<p>
						By using this website, you agree to comply with and be bound by
						the following terms and conditions of use. If you disagree with
						any part of these terms, please do not use our website.
					</p>
				</div>
				<div>
					<p class="slab level-three-voice">1. Acceptance of Terms</p>
					<p>
						By accessing or using our services, you agree to be bound by these
						Terms of Service, all applicable laws and regulations, and agree
						that you are responsible for compliance with any applicable local
						laws.
					</p>
				</div>
				<div>
					<p class="slab level-three-voice">2. User Registration</p>
					<p>
						a. To access certain features of the site, you may be required to
						register for an account. You agree to provide accurate, current,
						and complete information during the registration process. b. You
						are responsible for maintaining the confidentiality of your
						account and password and for restricting access to your computer.
						You agree to accept responsibility for all activities that occur
						under your account.
					</p>
				</div>
				<div>
					<p class="slab level-three-voice">3. User Content</p>
					<p>
						a. Users may submit content, including but not limited to blog
						posts, comments, and images. By submitting content, you grant
						<strong><span class="slab">Echo</span></strong> a non-exclusive,
						royalty-free, perpetual, irrevocable, and fully sublicensable
						right to use, reproduce, modify, adapt, publish, translate, create
						derivative works from, distribute, and display such content
						throughout the world in any media.
					</p>
					<p>
						b. You represent and warrant that you own or otherwise control all
						of the rights to the content that you post; that the content is
						accurate; that use of the content you supply does not violate this
						policy and will not cause injury to any person or entity; and that
						you will indemnify [Your Blog Site] for all claims resulting from
						content you supply.
					</p>
				</div>
				<div>
					<p class="slab level-three-voice">4. Prohibited Conduct</p>
					<p>You agree not to:</p>
					<p>
						a. Use the website in any way that may impair its performance,
						corrupt or manipulate the content, or otherwise reduce the overall
						functionality of the site.
					</p>
					<p>
						b. Use the website for any illegal, unethical, or unauthorized
						purpose.
					</p>
					<p>
						c. Post or transmit any content that is unlawful, harmful,
						threatening, abusive, harassing, defamatory, vulgar, obscene,
						libelous, invasive of another's privacy, hateful, or racially,
						ethnically, or otherwise objectionable.
					</p>
				</div>
				<div>
					<p class="slab level-three-voice">5. Termination of Access</p>
					<p>
						Echo reserves the right to terminate or suspend your access to the
						website at any time, with or without cause, and with or without
						notice.
					</p>
				</div>
				<div>
					<p class="slab level-three-voice">6. Changes to Terms</p>
					<p>
						Echo reserves the right to modify or replace these terms at any
						time. Your continued use of the site after any such changes
						constitutes your acceptance of the new terms.
					</p>
				</div>
				<div>
					<p class="slab level-three-voice">9. Contact Information</p>
					<p>
						If you have any questions about this privacy policy, you can
						contact us at
						<a
							class="underline"
							href="
EchoTheBlog@gmail.com?subject=Hello"
						>
							EchoTheBlog@gmail.com</a
						>. Thank you for using
						<strong><span class="slab">Echo</span></strong
						>!
					</p>
				</div>
			</text-module>
		</inner-column>
	</section>
</template>

<script setup></script>

<style lang="scss">
	text-module {
		display: flex;
		flex-direction: column;
		gap: 3.5rem;
		width: 100%;

		.underline {
			text-decoration: underline;
		}
		div {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}

		.level-three-voice {
			line-height: 1.2;
		}

		.slab {
			font-family: 'Roboto Slab', serif;
		}

		.logo {
			width: 40px;

			line-height: 1;
			text-align: center;
			font-size: var(--size-xl);
		}

		.opac-70 {
			opacity: 0.7;
		}

		h1 {
			line-height: 0.9;
		}
	}
</style>
