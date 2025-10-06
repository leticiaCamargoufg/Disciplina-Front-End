import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "./jwt";

export const requireAuth = (req: NextRequest) => {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  try {
    const payload = verifyJwt(auth.split(" ")[1]);
    return { payload };
  } catch {
    return { error: NextResponse.json({ error: "Invalid token" }, { status: 401 }) };
  }
};
