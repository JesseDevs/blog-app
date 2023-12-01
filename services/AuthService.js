import { defineStore } from 'pinia';

export const useAuthService = defineStore('auth', () => {
	const supabase = useSupabaseClient();
	const supaUser = useSupabaseUser();

	const router = useRouter();
	const signedIn = computed(() => user.value);
	const user = computed(() => supaUser.value);
	// Function to handle user sign-up with email and password
	async function signUpWithEmail(form) {
		try {
			if (!form.email || !form.password) {
				throw new Error('Email and password are required.');
			}

			// Sign up the user with Supabase Auth
			const { NewUser, error: authError } = await supabase.auth.signUp({
				email: form.email,
				password: form.password,
			});

			if (authError) {
				throw authError;
			}

			console.log(NewUser);

			// Add user details to the custom 'users' table in Supabase database
			const { data, error: dbError } = await supabase.from('users').upsert([
				{
					auth_id: user.id,
					email: form.email,
					username: form.username,
				},
			]);

			if (dbError) {
				throw dbError;
			}

			form.successMessage = `Check your email and confirm you're real`;
		} catch (error) {
			console.error('Sign-up error:', error);
			form.errorMessage = error.message;
		}
	}

	async function signInWithEmail(form) {
		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email: form.email,
				password: form.password,
			});
			if (error) throw error;
			return true; // for contextual redirect
		} catch (error) {
			console.error('Sign-up error:', error);
			form.errorMessage = error.message;
		}
	}

	// trigger a redirect
	// async function handleSignInForm(form) {
	// 	try {
	// 		const success = await signInWithEmail(form);
	// 		if (success) {
	// 			// Redirect the user to the desired page
	// 			router.push('/dashboard');
	// 		}
	// 	} catch (error) {
	// 		// Handle error or display error message
	// 	}
	// }

	async function signOut() {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			console.log('User signed out successfully');
			router.push('/');
		} catch (error) {
			console.error(error.message);
		}
	}

	return {
		user,

		signUpWithEmail,
		signInWithEmail,
		signOut,
	};
});
