import { cookies, headers } from "next/headers";
import { verifyJwt } from "./jwt";

export async function getAuthToken() {
  // Next 15: headers() e cookies() são async
  const h = await headers();
  const auth = h.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.split(" ")[1];

  const c = await cookies();
  return c.get("token")?.value ?? null;
}

export async function getUserFromRequest() {
  const token = await getAuthToken();
  if (!token) return null;
  try {
    return verifyJwt(token); // síncrono
  } catch {
    return null;
  }
}
