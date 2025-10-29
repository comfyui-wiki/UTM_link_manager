// ========== Encryption Functions ==========

(function() {
    'use strict';

// Generate encryption key from password
const deriveKey = async (password) => {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    
    // Use PBKDF2 to derive a key from password
    const baseKey = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
    );
    
    // Use a fixed salt (stored openly) - in production, use per-user salt
    const salt = encoder.encode('comfyui-utm-manager-v1');
    
    return await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        baseKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
};

// Encrypt data
const encryptData = async (data, password) => {
    const key = await deriveKey(password);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encryptedBuffer = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        dataBuffer
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);
    
    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
};

// Decrypt data
const decryptData = async (encryptedData, password) => {
    try {
        if (!encryptedData || typeof encryptedData !== 'string') {
            console.error('Decryption failed: Invalid encrypted data');
            return null;
        }
        
        if (!password || typeof password !== 'string' || password.length === 0) {
            console.error('Decryption failed: Invalid password');
            return null;
        }
        
        const key = await deriveKey(password);
        
        // Validate and decode from base64
        let combined;
        try {
            const base64Decoded = atob(encryptedData);
            if (base64Decoded.length < 12) {
                console.error('Decryption failed: Encrypted data too short (missing IV)');
                return null;
            }
            combined = Uint8Array.from(base64Decoded, c => c.charCodeAt(0));
        } catch (error) {
            console.error('Decryption failed: Invalid base64 encoding', error);
            return null;
        }
        
        // Extract IV and encrypted data
        const iv = combined.slice(0, 12);
        const data = combined.slice(12);
        
        if (data.length === 0) {
            console.error('Decryption failed: No encrypted data after IV');
            return null;
        }
        
        const decryptedBuffer = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            data
        );
        
        const decoder = new TextDecoder();
        const decrypted = decoder.decode(decryptedBuffer);
        
        // Validate decrypted data is not empty
        if (!decrypted || decrypted.length === 0) {
            console.error('Decryption failed: Decrypted data is empty');
            return null;
        }
        
        return decrypted;
    } catch (error) {
        console.error('Decryption failed:', error);
        // Don't expose internal error details to prevent timing attacks
        return null;
    }
};

// Check if encryption is set up
const isEncryptionEnabled = () => {
    return localStorage.getItem('encryption_enabled') === 'true';
};

// Get cached encryption password (only in memory, never stored)
const getEncryptionPassword = () => {
    return sessionStorage.getItem('encryption_password');
};

// Set encryption password (only for current session)
const setEncryptionPassword = (password) => {
    sessionStorage.setItem('encryption_password', password);
};

// Clear encryption password
const clearEncryptionPassword = () => {
    sessionStorage.removeItem('encryption_password');
};

// Export encryption functions to global scope (without leaking to global)
window.encryption = {
    encryptData,
    decryptData,
    isEncryptionEnabled,
    getEncryptionPassword,
    setEncryptionPassword,
    clearEncryptionPassword
};

})();
