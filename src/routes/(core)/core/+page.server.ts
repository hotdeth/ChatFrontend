import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({ fetch, cookies }) => {
  const res1 = await fetch('http://localhost:8080/users', {
    method: "GET", headers: {
      "Authorization": `Bearer ${cookies.get('access_token')}`
    }
  })
  const res2 = await fetch('http://localhost:8080/friend', {
    method: "GET", headers: {
      "Authorization": `Bearer ${cookies.get('access_token')}`
    }
  })
  const userData = await res1.json()
  const user2Data = await res2.json()

  return { users: userData, friends: user2Data }
}
