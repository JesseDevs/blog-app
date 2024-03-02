// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	pages: true,

	app: {
		pageTransition: { name: 'layout', mode: 'out-in' },
		head: {
			title: 'ECHO',

			meta: [
				{ charset: 'utf-8' },
				{
					name: 'viewport',
					content: 'width=device-width, initial-scale=1, maximum-scale=1',
				},
			],
		},
	},
	modules: [
		'nuxt-icon',
		'@pinia/nuxt',
		'@vueuse/nuxt',
		'@nuxt/image-edge',
		'@nuxtjs/supabase',
		'@nuxtjs/google-fonts',
		'@nuxtjs/color-mode',
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
	colorMode: {
		preference: 'system',
		fallback: 'dark',
		hid: 'nuxt-color-mode-script',
		globalName: '__NUXT_COLOR_MODE__',
		componentName: 'ColorScheme',
		classPrefix: '',
		classSuffix: '-mode',
		storageKey: 'nuxt-color-mode',
	},
	supabase: {
		url: process.env.SUPABASE_URL,
		key: process.env.SUPABASE_KEY,
		redirect: false,
	},
	components: true,
	imports: {
		dirs: ['./services'],
	},
	devtools: { enabled: false },
});
