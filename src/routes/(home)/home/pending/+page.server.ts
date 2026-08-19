import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { BASE_URL } from "$env/static/private";


export const load: PageServerLoad = async ({ cookies, fetch }) => {
  const access = cookies.get("access_token")


  try {
    const res = await fetch(`${BASE_URL}/pending/request`, {
      method: "GET", headers: {
        "Authorization": `Bearer ${access}`
      }
    })
    const data = await res.json()
    if (!res.ok) {
      return { requests: null }
    }
    return { requests: data }
  } catch (err) {
    return { requests: null }
  }
}



export const actions: Actions = {
  follow: async ({ fetch, request, cookies }) => {
    const session = cookies.get("access_token")
    const formData = await request.formData()
    const id = formData.get("req_id")
    try {
      const res = await fetch(`${BASE_URL}/friend/${Number(id)}`, {
        method: "POST", headers: {
          "Authorization": `Bearer ${session}`
        }, body: JSON.stringify({ "status": "accepted" })
      })
      if (!res.ok) {
        return { error: true }
      }
    } catch (err) {
      console.log(err)
      return { error: true }
    }
  }
}
