import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

interface DecodedToken {
  userId: number;
}

export function decodeToken(token: string): DecodedToken {
  const secretKey = process.env.SECRET_KEY;
  const decoded = jwt.verify(token, secretKey) as JwtPayload & DecodedToken;
  return decoded as DecodedToken;
}
