import { redirect, type Handle } from "@sveltejs/kit";



export const handle: Handle = async ({ event, resolve }) => {
  const session = event.cookies.get("access_token")
  const privateRoute = event.url.pathname.startsWith('/home')
  if (!session && privateRoute) {
    return redirect(303, '/auth/login')
  }
  return await resolve(event)
}
