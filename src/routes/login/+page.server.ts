import { redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  login: async ({ request, cookies, fetch }) => {
    const formData = await request.formData();

    const username = formData.get("username");
    const password = formData.get("password");

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
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const data = await res.json();

      // Backend returned an error
      if (!res.ok) {
        return {
          error: data?.message || data?.detail || "Invalid username or password."
        };
      }

      // Make sure the backend actually returned tokens
      if (!data.access_token || !data.refresh_token) {
        return {
          error: "Invalid response from authentication server."
        };
      }

      // Access token
      cookies.set("access_token", data.access_token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 60 * 15
      });

      // Refresh token
      cookies.set("refresh_token", data.refresh_token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: false
      });

    } catch (err) {
      console.error("Login error:", err);

      return {
        error: "Unable to connect to authentication server."
      };
    }

    // IMPORTANT:
    // redirect() must be outside the try/catch
    throw redirect(303, "/core");
  }
};
