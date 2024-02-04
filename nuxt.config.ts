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
		'@nuxtjs/google-fonts',
	],
	googleFonts: {
		preload: true,
		families: {
			'Roboto+Slab': [100, 200, 300, 400, 500, 600, 700, 800, 900],
			'DM+Sans': [100, 200, 300, 400, 500, 600, 700, 800, 900],
		},
		display: 'block',
	},
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
		url: process.env.SUPABASE_URL,
		key: process.env.SUPABASE_KEY,
		redirect: false,
	},
	components: true,
	imports: {
		dirs: ['./stores'],
	},
	devtools: { enabled: false },
});
