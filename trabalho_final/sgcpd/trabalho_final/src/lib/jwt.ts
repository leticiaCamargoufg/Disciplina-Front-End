import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET!;

export type JwtPayload = { uid: string; role: string };
export const signJwt = (payload: JwtPayload, expiresIn = "7d") =>
  jwt.sign(payload, secret, { expiresIn });

export const verifyJwt = (token: string) =>
  jwt.verify(token, secret) as JwtPayload;
