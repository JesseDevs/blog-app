import { defineStore } from 'pinia';

export const useThemeService = defineStore('theme', () => {
	const colorMode = useColorMode({
		initialValue: 'dark',
	});
	const selectedTheme = ref(null);
	const themeShowcase = ref(false);

	const colorModes = [
		'dark',
		'light',
		'vampire',
		'canary',
		'low-contrast',
		'glitch',
		'venomized',
		'sepia',
	];
	const colorModeIndex = ref(0);

	const themeNumber = computed(() => colorModeIndex.value + 1);

	const setSelectedTheme = (theme) => {
		if (theme !== selectedTheme.value) {
			selectedTheme.value = theme;
			localStorage.setItem('nuxt-color-mode', theme);
		}
	};

	const changePalette = () => {
		themeShowcase.value = true;
		colorModeIndex.value = (colorModeIndex.value + 1) % colorModes.length;
		colorMode.preference = colorModes[colorModeIndex.value];
		setSelectedTheme(colorModes[colorModeIndex.value]);
	};

	onMounted(() => {
		const savedTheme = localStorage.getItem('nuxt-color-mode');
		if (savedTheme && colorModes.includes(savedTheme)) {
			selectedTheme.value = savedTheme;
		}
	});

	return {
		selectedTheme,
		colorMode,
		colorModes,
		colorModeIndex,
		setSelectedTheme,
		changePalette,
		themeNumber,
		themeShowcase,
	};
});
