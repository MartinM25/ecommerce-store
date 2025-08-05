// Modern crypto utilities using Web Crypto API and Node.js crypto
import { createHash, createHmac, randomBytes } from 'crypto'

/**
 * Generate MD5 hash (for PayFast compatibility)
 * PayFast still requires MD5 for legacy reasons
 */
export function generateMD5Hash(data: string): string {
  if (typeof window !== 'undefined') {
    throw new Error('MD5 hashing should only be used on server-side for PayFast')
  }
  return createHash('md5').update(data, 'utf8').digest('hex')
}

/**
 * Generate SHA256 hash (for secure tokens)
 */
export async function generateSHA256Hash(data: string): Promise<string> {
  if (typeof window !== 'undefined') {
    // Browser environment - use Web Crypto API
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  } else {
    // Node.js environment
    return createHash('sha256').update(data, 'utf8').digest('hex')
  }
}

/**
 * Generate HMAC-SHA256 (for secure API signatures)
 */
export function generateHMAC(data: string, secret: string): string {
  if (typeof window !== 'undefined') {
    throw new Error('HMAC generation should only be used on server-side')
  }
  return createHmac('sha256', secret).update(data, 'utf8').digest('hex')
}

/**
 * Generate secure random token
 */
export async function generateSecureToken(length: number = 32): Promise<string> {
  if (typeof window !== 'undefined') {
    // Browser environment
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  } else {
    // Node.js environment
    return randomBytes(length).toString('hex')
  }
}

/**
 * Generate PayFast signature (server-side only)
 */
export function generatePayFastSignature(data: Record<string, any>, passphrase: string): string {
  if (typeof window !== 'undefined') {
    throw new Error('PayFast signature generation must be server-side only')
  }

  // Create query string from payment data
  const queryString = Object.entries(data)
    .filter(([key, value]) => value !== '' && value !== null && value !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&')
  
  // Add passphrase and generate MD5 hash
  const stringToHash = queryString + '&passphrase=' + passphrase
  return generateMD5Hash(stringToHash)
}

/**
 * Verify PayFast ITN signature
 */
export function verifyPayFastSignature(postData: Record<string, any>, passphrase: string): boolean {
  if (typeof window !== 'undefined') {
    throw new Error('PayFast signature verification must be server-side only')
  }

  const receivedSignature = postData.signature
  if (!receivedSignature) return false

  // Remove signature from data for verification
  const dataWithoutSignature = { ...postData }
  delete dataWithoutSignature.signature

  const calculatedSignature = generatePayFastSignature(dataWithoutSignature, passphrase)
  return receivedSignature === calculatedSignature
}

/**
 * Generate download token for digital products
 */
export async function generateDownloadToken(orderItemId: number, userId: string): Promise<string> {
  const data = `${orderItemId}-${userId}-${Date.now()}-${await generateSecureToken(16)}`
  return await generateSHA256Hash(data)
}

/**
 * Generate password reset token
 */
export async function generateResetToken(email: string): Promise<string> {
  const data = `${email}-${Date.now()}-${await generateSecureToken(32)}`
  return await generateSHA256Hash(data)
}

/**
 * Time-safe string comparison to prevent timing attacks
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}