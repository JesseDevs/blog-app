// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	pages: true,

	app: {
		pageTransition: { name: 'layout', mode: 'out-in' },
	},
	modules: [
		'nuxt-icon',
		'@pinia/nuxt',
		'@vueuse/nuxt',
		'@nuxt/image-edge',
		'@nuxtjs/supabase',
	],
	vue: {
		compilerOptions: {
			isCustomElement: (tag) => tag.includes('-'),
		},
	},
	css: ['~/assets/css/globals.css'],
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@use "~/assets/css/styles.scss" as *;',
				},
			},
		},
	},
	supabase: {
		redirect: false,
	},
	components: true,
	imports: {
		dirs: ['./stores'],
	},
	devtools: { enabled: false },
});
