
import { BASE_URL } from "$env/static/private";
import { redirect, type Actions } from "@sveltejs/kit";









export const actions: Actions = {
  signup: async ({ request, cookies, fetch }) => {
    const formData = await request.formData()
    const username = formData.get('username')
    const password = formData.get('password')
    const name = formData.get('name')
    const key = formData.get('key')
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, { method: "POST", body: JSON.stringify({ username, password, name, key }) })
      const data = await res.json()
      if (!res.ok) {
        return { error: data }
      }
      throw redirect(303, "/login")
    } catch (err) {
      return { error: "Internal Error" }
    }
  }
}
