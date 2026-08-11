import { env } from '$env/dynamic/public';

const BASE_URL = env.PUBLIC_API_URL || 'http://localhost:8080';

/**
 * @param {string} message
 */
class ApiError extends Error {
	constructor(message, status) {
		super(message);
		this.status = status;
	}
}

async function request(path, body) {
	const res = await fetch(`${BASE_URL}${path}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});

	const data = await res.json().catch(() => ({}));

	if (!res.ok) {
		throw new ApiError(data.message || `Request failed with status ${res.status}`, res.status);
	}

	return data;
}

// Mirrors Login.yml: POST {{URL}}/auth/login -> { access_token }
export function login(username, password) {
	return request('/auth/login', { username, password });
}

// Mirrors Register.yml: POST {{URL}}/auth/register -> new account
export function register(username, name, password) {
	return request('/auth/register', { username, name, password });
}
