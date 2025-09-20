import { EncryptedPayload } from '../types';

// Helper functions for string/buffer/hex conversions
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const hexToBuffer = (hex: string): Uint8Array => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
};

const bufferToHex = (buffer: ArrayBuffer): string => {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

const cryptoService = {
  // Generates a new random salt (16 bytes)
  generateSalt: (): Uint8Array => {
    return window.crypto.getRandomValues(new Uint8Array(16));
  },

  // Derives a 256-bit AES-GCM key from a PIN and a salt using PBKDF2.
  deriveKey: async (pin: string, salt: Uint8Array): Promise<CryptoKey> => {
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(pin),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000, // A standard number of iterations
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  },

  // Encrypts a string of data using the derived key.
  encrypt: async (data: string, key: CryptoKey): Promise<EncryptedPayload> => {
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // IV for AES-GCM
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encoder.encode(data)
    );

    return {
      iv: bufferToHex(iv),
      cipherText: bufferToHex(encryptedData),
    };
  },

  // Decrypts an EncryptedPayload using the derived key.
  decrypt: async (payload: EncryptedPayload, key: CryptoKey): Promise<string> => {
    try {
      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: hexToBuffer(payload.iv),
        },
        key,
        hexToBuffer(payload.cipherText)
      );
      return decoder.decode(decryptedData);
    } catch (e) {
      console.error('Decryption failed:', e);
      throw new Error('Decryption failed. Invalid PIN or corrupted data.');
    }
  },
  
  // Expose helpers for use in components
  bufferToHex,
  hexToBuffer,
};

export default cryptoService;
