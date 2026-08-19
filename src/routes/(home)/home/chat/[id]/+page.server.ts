import { BASE_URL } from "$env/static/private";
import type { PageServerLoad } from "./$types";
export const load: PageServerLoad = async ({ params, cookies, fetch }) => {
  let messagess;
  const publicKey = await fetch(`${BASE_URL}/users/public/${params.id}`, {
    method: "GET", headers: {
      "Authorization": `Bearer ${cookies.get('access_token')}`,
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
  })
  const key = await publicKey.json()
  try {
    const res = await fetch(`${BASE_URL}/conv`, {
      method: "POST", headers: {
        "Authorization": `Bearer ${cookies.get('access_token')}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ "user2_id": Number(params.id) })
    })

    const data1 = await res.json()
    const res2 = await fetch(`${BASE_URL}/messages?convid=${Number(data1.id)}`, {
      method: "GET", headers: {
        "Authorization": `Bearer ${cookies.get('access_token')}`,
      }
    })
    const data2 = await res2.json()
    messagess = data2
    if (!res.ok) {
      console.log("err res")
    }
  } catch (err) {
    console.log(err)
  }
  return { userID: params.id, token: cookies.get('access_token'), messages: messagess, key: key }
}

