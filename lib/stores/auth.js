import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createAuthStore() {
	const initial = browser ? localStorage.getItem('access_token') : null;
	const { subscribe, set } = writable(initial);

	return {
		subscribe,
		setToken(token) {
			if (browser) localStorage.setItem('access_token', token);
			set(token);
		},
		clear() {
			if (browser) localStorage.removeItem('access_token');
			set(null);
		}
	};
}

export const token = createAuthStore();
