import type { PageServerLoad } from "./$types";





export const load: PageServerLoad = async ({ params, cookies }) => {
  const userCookie = cookies.get('user')
  let user;
  if (userCookie) {
    user = JSON.parse(userCookie)
    console.log(user)
  }
  console.log(cookies.get("access_token"))
  return { userID: params.id, token: cookies.get('access_token'), user: user }
}
