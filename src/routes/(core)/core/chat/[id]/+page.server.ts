import { BASE_URL } from "$env/static/private";
import type { PageServerLoad } from "./$types";





export const load: PageServerLoad = async ({ params, cookies, fetch }) => {
  const userCookie = cookies.get('user')
  let messagess;
  let user;
  if (userCookie) {
    user = JSON.parse(userCookie)
  }
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
    console.log(data1.id)
    const res2 = await fetch(`${BASE_URL}/messages?convid=${Number(data1.id)}`, {
      method: "GET", headers: {
        "Authorization": `Bearer ${cookies.get('access_token')}`,
      }
    })
    const data2 = await res2.json()
    messagess = data2
    console.log(data2)




    if (!res.ok) {
      console.log(res)
    }
  } catch (err) {
    console.log(err)
  }
  return { userID: params.id, token: cookies.get('access_token'), user: user, messages: messagess }
}
// try {
//    const res = await fetch(`${BASE_URL}/messages?convid=${conv_id}`, {
//      method: "POST", headers: {
//        "Authorization": `Bearer ${cookies.get('access_token')}`,
//        "Accept": "application/json",
//        "Content-Type": "application/json"
//      },
//    })
//    const messag = await res.json()
//    messagess = messag
//    console.log(messagess)
//    if (!res.ok) {
//      console.log(res)
//    }
//  } catch (err) {
//    console.log(err)
//  }

