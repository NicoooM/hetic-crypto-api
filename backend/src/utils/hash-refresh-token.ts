import crypto from "crypto";

export function hashToken(token: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(token).digest("hex");
}
