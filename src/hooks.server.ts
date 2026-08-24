import { BASE_URL } from "$env/static/private";
import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const session = event.cookies.get("access_token");
  const refresh = event.cookies.get("refresh_token");

  const privateRoute = event.url.pathname.startsWith("/home");

  if (!session && privateRoute && refresh) {
    try {
      const res = await event.fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refresh}`
        }
      });

      if (!res.ok) {
        event.cookies.delete("user", { path: "/" });
        event.cookies.delete("access_token", { path: "/" });
        event.cookies.delete("refresh_token", { path: "/" });

        throw redirect(303, "/auth/login");
      }

      const data = await res.json();

      event.cookies.set(
        "access_token",
        data.data.access_token,
        {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          secure: event.url.protocol === "https:",
          maxAge: 60 * 15
        }
      );

      event.cookies.set(
        "refresh_token",
        data.data.refresh_token,
        {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          secure: event.url.protocol === "https:"
        }
      );

      return resolve(event);
    } catch (err) {
      if (err instanceof Response) {
        throw err;
      }

      throw redirect(303, "/auth/login");
    }
  }

  return resolve(event);
};
