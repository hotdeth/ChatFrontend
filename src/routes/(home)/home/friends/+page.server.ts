import type { PageServerLoad } from "./$types";
import { BASE_URL } from "$env/static/private";


export const load: PageServerLoad = async ({ fetch, cookies }) => {
  const res2 = await fetch(`${BASE_URL}/friend`, {
    method: "GET", headers: {
      "Authorization": `Bearer ${cookies.get('access_token')}`
    }
  })
  const user2Data = await res2.json()
  return { friends: user2Data }
}


