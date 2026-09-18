import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";



export const load: LayoutServerLoad = async ({ cookies }) => {
  const userCookie = cookies.get('user')
  let user;
  if (userCookie) {
    user = JSON.parse(userCookie)
  }
  if (!user) {
    return redirect(303, "/auth/login")
  }
  return { user: user }
}





