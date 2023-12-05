<template>
	<section>
		<inner-column>
			<text-module>
				<div>
					<h1 class="level-five-voice">Privacy Policy</h1>
					<p class="small-voice opac-70">Last Updated: November 30, 2023</p>
				</div>
				<div>
					<p>
						Welcome to
						<span class="logo">E</span>cho: The Blog Site.
					</p>
					<p>
						This Privacy Policy explains how
						<strong><span class="slab">Echo</span></strong> collects, uses,
						and safeguards the personal information you provide when using our
						website.
					</p>
				</div>
				<div>
					<p class="slab level-three-voice">1. Information We Collect</p>
					<p>
						a. Personal Information: When you register for an account, we may
						collect personal information such as your name, email address, and
						other details you voluntarily provide. b. Log Data: Like many
						websites, we collect information that your browser sends whenever
						you visit our site. This may include your computer's IP address,
						browser type, browser version, and the pages you visit.
					</p>
				</div>
				<div>
					<p class="slab level-three-voice">2. How We Use Your Information</p>
					<p>
						a. Provide and Maintain the Service: We use the information
						collected to create and manage user accounts, authenticate users,
						and provide the services you request. b. Communications: We may
						use your email address to send you updates, newsletters, and other
						information related to [Your Blog Site]. You can opt-out of these
						communications at any time. c. Analytics: We may use third-party
						analytics services to analyze and track usage patterns on our
						website. This helps us improve our services and enhance user
						experience.
					</p>
				</div>
				<div>
					<p class="slab level-three-voice">3. Cookies</p>
					<p>
						a. We use cookies to collect information and enhance your
						experience on our website. You can instruct your browser to refuse
						all cookies or to indicate when a cookie is being sent.
					</p>
				</div>
				<div>
					<p class="slab level-three-voice">4. Disclosure of Information</p>
					a. We will not sell, trade, or otherwise transfer your personal
					information to outside parties unless we provide you with advance
					notice. This does not include trusted third parties who assist us in
					operating our website or servicing you, as long as those parties agree
					to keep this information confidential.
				</div>
				<div>
					<p class="slab level-three-voice">5. Security</p>
					<p>
						a. We take reasonable measures to protect your personal
						information from unauthorized access, alteration, disclosure, or
						destruction.
					</p>
				</div>
				<div>
					<p class="slab level-three-voice">6. Your Choices</p>
					a. You can update or delete your account information at any time by
					logging into your account settings.
				</div>
				<div>
					<p class="slab level-three-voice">7. Third-Party Links</p>
					a. Our website may contain links to third-party websites. We are not
					responsible for the privacy practices or content of these sites.
				</div>
				<div>
					<p class="slab level-three-voice">
						8. Changes to This Privacy Policy
					</p>
					<p>
						a. We reserve the right to update or change our privacy policy at
						any time. Your continued use of the website after any such changes
						will constitute your acceptance of the new policy.
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
