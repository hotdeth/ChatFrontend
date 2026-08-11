import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./login/$types";

export const load: PageServerLoad = async () => {
  return redirect(303, "/core")
}
