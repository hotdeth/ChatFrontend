import type { PageServerLoad } from "./$types";





export const load: PageServerLoad = async ({ params, cookies }) => {
  return { userID: params.id, token: cookies.get('access_token') }
}
