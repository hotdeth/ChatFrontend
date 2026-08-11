import { redirect, type Handle } from "@sveltejs/kit";



export const handle: Handle = async ({ event, resolve }) => {
  const session = await event.cookies.get("access_token")
  const refresh = await event.cookies.get("refresh_token")

  const privateRoute = event.url.pathname.startsWith('/core')

  if (!session && privateRoute) {
    return redirect(303, '/login')
  }


  return await resolve(event)
}
