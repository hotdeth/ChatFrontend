import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({ fetch, cookies }) => {
  const userCookie = cookies.get('user')
  let user;
  if (userCookie) {
    user = JSON.parse(userCookie)
  }
  const res1 = await fetch('http://localhost:8080/users', {
    method: "GET", headers: {
      "Authorization": `Bearer ${cookies.get('access_token')}`
    }
  })
  const userData = await res1.json()

  return { users: userData, user: user }
}



export const actions: Actions = {
  follow: async ({ fetch, request, cookies }) => {
    const session = cookies.get("access_token")
    const formData = await request.formData()
    const id = Number(formData.get("receive_id"))
    const message = String(formData.get('message'))
    console.log(id)
    try {
      const res = await fetch('http://localhost:8080/friend/request', {
        method: "POST", headers: {
          "Authorization": `Bearer ${session}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        }, body: JSON.stringify({
          "receiver_id": id,
          "message": message
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
