import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_AES_KEY as string;

export function encryptPassword(password: string): string {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(password, key, { iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC });

  const result = iv.concat(encrypted.ciphertext);
  return CryptoJS.enc.Base64.stringify(result);
}
