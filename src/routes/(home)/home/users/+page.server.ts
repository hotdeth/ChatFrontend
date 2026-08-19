import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { BASE_URL } from "$env/static/private";


export const load: PageServerLoad = async ({ fetch, cookies }) => {
  const res1 = await fetch(`${BASE_URL}/users`, {
    method: "GET", headers: {
      "Authorization": `Bearer ${cookies.get('access_token')}`
    }
  })
  const userData = await res1.json()
  return { users: userData }
}



export const actions: Actions = {
  follow: async ({ fetch, request, cookies }) => {
    const session = cookies.get("access_token")
    const formData = await request.formData()
    const id = Number(formData.get("receive_id"))
    const message = String(formData.get('message'))
    try {
      const res = await fetch(`${BASE_URL}/friend/request`, {
        method: "POST", headers: {
          "Authorization": `Bearer ${session}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        }, body: JSON.stringify({
          "receiver_id": id,
          "message": message
        })
      })
      if (!res.ok) {
        return { error: true }
      }
    } catch (err) {
      return { error: true }
    }
  }
}
