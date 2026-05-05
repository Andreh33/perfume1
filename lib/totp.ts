import "server-only";
import { Secret, TOTP } from "otpauth";
import { randomBytes } from "node:crypto";

const APP = "Sol Perfumes Árabes";

export function generateTotpSecret(label: string) {
  const secret = new Secret({ size: 20 });
  const totp = new TOTP({
    issuer: APP,
    label,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret,
  });
  return {
    base32: secret.base32,
    otpauthUrl: totp.toString(),
  };
}

export function verifyTotp(secretBase32: string, token: string): boolean {
  if (!token || token.length < 6) return false;
  const totp = new TOTP({
    issuer: APP,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(secretBase32),
  });
  const delta = totp.validate({ token, window: 1 });
  return delta !== null;
}

export function generateBackupCodes(count = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const buf = randomBytes(5).toString("hex").toUpperCase();
    codes.push(`${buf.slice(0, 4)}-${buf.slice(4, 8)}`);
  }
  return codes;
}

export function consumeBackupCode(stored: string[], submitted: string): string[] | null {
  const idx = stored.findIndex((c) => c === submitted.trim().toUpperCase());
  if (idx === -1) return null;
  return [...stored.slice(0, idx), ...stored.slice(idx + 1)];
}
