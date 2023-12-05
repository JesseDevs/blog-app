import { defineStore } from 'pinia';

export const useAuthService = defineStore('auth', () => {
	const client = useSupabaseClient();
	const router = useRouter();
	const user = useSupabaseUser();
	const signedIn = computed(() => user.value !== null);
	const userProfile = ref(null);

	const updateProfileIfNeeded = async () => {
		if (user.value) {
			const { data, error } = await client
				.from('profiles')
				.select()
				.eq('id', user.value.id)
				.single();

			if (error) {
				console.error('Error fetching user profile:', error.message);
			} else {
				userProfile.value = data;
			}
		}
	};

	onMounted(async () => {
		updateProfileIfNeeded();
	});

	watchEffect(async () => {
		updateProfileIfNeeded();
	});

	const fetchUserProfile = async (user) => {
		try {
			if (user.value) {
				const { data, error } = await client
					.from('profiles')
					.select()
					.eq('id', user.value.id)
					.single();

				if (error) {
					console.error('Error fetching user profile:', error.message);
				} else {
					return data;
				}
			}
		} catch (error) {
			console.error('Error fetching user profile:', error.message);
		}
		return null; // Return null if there's an error or no user value
	};

	const credentials = reactive({
		fullName: '',
		username: '',
		email: '',
		password: '',
		successMessage: '',
		errorMessage: '',
	});

	const register = async () => {
		const { fullName, username, email, password } = credentials;
		const { error } = await client.auth.signUp({
			email,
			password,
			options: {
				data: {
					full_name: fullName,
					username,
					email,
				},
				emailRedirectTo: 'http://localhost:3000/login',
			},
		});

		if (error) {
			if (error.message.includes('unique constraint')) {
				credentials.errorMessage = 'Email or username already exists.';
			} else {
				credentials.errorMessage = 'Registration failed. Please try again.';
			}
			console.error(error);
			return;
		}
		isModalOpen.value = true;
	};

	async function signInWithEmail() {
		const { error } = await client.auth.signInWithPassword({
			email: credentials.email,
			password: credentials.password,
		});

		if (!error) {
			router.push('/');
		} else {
			console.error(error);
		}
	}

	const signOutUser = async () => {
		try {
			const { error } = await client.auth.signOut();

			if (error) {
				throw error;
			}

			console.log('User signed out successfully');
			userProfile.value = null;
			ui.closeMenu();
			router.push('/');
		} catch (error) {
			console.error('Error signing out user:', error.message);
		}
	};

	const isModalOpen = ref(false);
	const closeModal = () => {
		isModalOpen.value = false;
	};

	const showPassword = ref(false);
	const togglePassword = () => {
		if (credentials.password) {
			showPassword.value = !showPassword.value;
		}
	};

	return {
		user,
		signedIn,
		signInWithEmail,
		signOutUser,
		userProfile,
		credentials,
		isModalOpen,
		register,
		closeModal,
		showPassword,
		togglePassword,
	};
});
