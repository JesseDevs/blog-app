import { defineStore } from 'pinia';

export const useInterfaceService = defineStore('interface', () => {
	const mainMenuOpen = ref(false);
	const footerMenu = ref(false);
	const menuClass = computed(() => (mainMenuOpen.value ? 'menu-open' : 'menu-close'));

	const footerClass = computed(() =>
		footerMenu.value ? 'footer-open' : 'footer-close',
	);

	const toggleMainMenu = () => {
		mainMenuOpen.value = !mainMenuOpen.value;
	};

	const closeMenu = () => {
		mainMenuOpen.value = false;
	};

	const toggleFooterMenu = () => {
		footerMenu.value = !footerMenu.value;
	};

	const closeFooterMenu = () => {
		footerMenu.value = false;
	};

	useHead({
		bodyAttrs: {
			class: computed(() => {
				if (mainMenuOpen.value) return 'overflow';

				return '';
			}),
		},
	});

	const goBack = () => {
		router.go(-1);
	};

	return {
		mainMenuOpen,
		menuClass,
		toggleMainMenu,
		closeMenu,
		goBack,
		toggleFooterMenu,
		closeFooterMenu,
		footerClass,
		footerMenu,
	};
});
