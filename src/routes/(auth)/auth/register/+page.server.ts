import { BASE_URL } from "$env/static/private";
import { redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  register: async ({ request, fetch }) => {
    const formData = await request.formData();

    const username = formData.get("username");
    const name = formData.get("name");
    const password = formData.get("password");
    const key = formData.get('key')

    // Validate form data
    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password
    ) {
      return {
        error: "Username and password are required."
      };
    }
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password,
          name,
          key
        })
      });
      if (!res.ok) {
        const data = await res.json();
        return {
          error: data?.message || data?.detail || "Username is Already Used"
        };
      }
    } catch (err) {
      console.error("Login error:", err);

      return {
        error: "Unable to connect to authentication server."
      };
    }
    throw redirect(303, "/auth/login");
  }
};
