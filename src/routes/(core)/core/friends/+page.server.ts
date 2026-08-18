import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { BASE_URL } from "$env/static/private";


export const load: PageServerLoad = async ({ fetch, cookies }) => {
  const userCookie = cookies.get('user')
  let user;
  if (userCookie) {
    user = JSON.parse(userCookie)
  }
  const res2 = await fetch(`${BASE_URL}/friend`, {
    method: "GET", headers: {
      "Authorization": `Bearer ${cookies.get('access_token')}`
    }
  })
  const user2Data = await res2.json()

  return { friends: user2Data, user: user }
}



export const actions: Actions = {
  follow: async ({ fetch, request, cookies }) => {
    const session = cookies.get("access_token")
    const formData = await request.formData()
    const id = Number(formData.get("receive_id"))
    console.log(id)
    try {
      const res = await fetch(`${BASE_URL}/friend/request`, {
        method: "POST", headers: {
          "Authorization": `Bearer ${session}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        }, body: JSON.stringify({
          "receiver_id": id,
          "message": "hey im just your friend from china"
        })
      })
      console.log(res)
      if (!res.ok) {
        return { error: true }
      }
    } catch (err) {
      console.log(err)
      return { error: true }
    }
  }
}
