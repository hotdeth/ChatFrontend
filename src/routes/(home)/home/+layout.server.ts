import type { LayoutServerLoad } from "./$types";



export const load: LayoutServerLoad = async ({ cookies }) => {
  const userCookie = cookies.get('user')
  let user;
  if (userCookie) {
    user = JSON.parse(userCookie)
  }

  return { user: user }
}





