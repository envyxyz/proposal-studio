import crypto from 'crypto';

/**
 * Stable JSON serialization helper to guarantee consistent hashing
 * regardless of key insertion order.
 */
export function stableStringify(obj: any): string {
  if (obj === null) return 'null';
  if (typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return '[' + obj.map(stableStringify).join(',') + ']';
  }
  const keys = Object.keys(obj).sort();
  return '{' + keys.map(k => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(',') + '}';
}

/**
 * Computes a SHA-256 hex checksum of a proposal's serialized content blob.
 */
export function hashProposal(content: any): string {
  const stableString = stableStringify(content);
  return crypto.createHash('sha256').update(stableString).digest('hex');
}

/**
 * Verifies if the signature document hash matches the current proposal content hash.
 */
export function verifySignature(content: any, storedHash: string): boolean {
  const currentHash = hashProposal(content);
  return currentHash === storedHash;
}
