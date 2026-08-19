import { redirect, type Actions } from "@sveltejs/kit";



export const actions: Actions = {
  logout: async ({ cookies }) => {
    cookies.delete('access_token', { path: "/" })
    cookies.delete('refresh_token', { path: "/" })
    cookies.delete('user', { path: "/" })
    throw redirect(303, '/auth/login')
  }
}
