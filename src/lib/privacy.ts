import crypto from 'crypto';

const key = Buffer.from(process.env.SECRET_KEY!, 'hex');
const iv = Buffer.from(process.env.IV_KEY!, 'hex');

export function Encrypt(text: string) {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

export function Decrypt(encryptedText: string) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
