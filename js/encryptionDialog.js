// ========== Encryption Dialog Module ==========
// This module handles encryption setup and unlock dialogs

(function() {
    'use strict';

    // Dependencies (will be set when modules load)
    let encryption, utils, bitly;

    // Initialize dependencies
    function init() {
        encryption = window.encryption;
        utils = window.utils;
        bitly = window.bitly;
    }

    // Wait for DOM and dependencies
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ========== Encryption Setup ==========

    async function setupEncryptionDialog() {
        const result = await Swal.fire({
            title: '🔒 Security Setup',
            html: `
                <p style="margin-bottom: 20px; color: #666;">Create a master password to encrypt your API tokens</p>
                <input type="password" id="swal-setup-password" class="swal2-input" placeholder="Master password (min 8 chars)">
                <input type="password" id="swal-setup-password-confirm" class="swal2-input" placeholder="Confirm password">
                <div style="margin-top: 15px; padding: 10px; background: #f0f7ff; border-radius: 4px; font-size: 13px; text-align: left;">
                    🔒 <strong>Encrypted & Secure:</strong><br>
                    • Password never saved (session only)<br>
                    • Auto-lock when tab closes<br>
                    • AES-256 encryption
                </div>
            `,
            showCancelButton: true,
            confirmButtonColor: '#667eea',
            confirmButtonText: '🔒 Enable Encryption',
            cancelButtonText: 'Cancel',
            allowOutsideClick: false,
            preConfirm: () => {
                const password = document.getElementById('swal-setup-password').value;
                const passwordConfirm = document.getElementById('swal-setup-password-confirm').value;
                
                if (!password || password.length < 8) {
                    Swal.showValidationMessage('Password must be at least 8 characters');
                    return false;
                }
                
                if (password !== passwordConfirm) {
                    Swal.showValidationMessage('Passwords do not match');
                    return false;
                }
                
                return { password };
            }
        });
        
        if (!result.isConfirmed) return false;
        
        const { password } = result.value;
        
        try {
            // Enable encryption flag
            localStorage.setItem('encryption_enabled', 'true');
            
            // Store password in session
            encryption.setEncryptionPassword(password);
            
            utils.showSuccess('Encryption enabled! Your tokens will be protected.', 'Encryption Enabled');
            
            return true;
            
        } catch (error) {
            utils.showError('Failed to enable encryption: ' + error.message, 'Encryption Error');
            return false;
        }
    }

    // ========== Unlock Dialog ==========

    async function unlockEncryptionDialog() {
        const result = await Swal.fire({
            title: '🔒 Unlock',
            html: `
                <p style="margin-bottom: 15px; color: #666;">Enter your master password to access encrypted credentials</p>
                <input type="password" id="swal-unlock-password" class="swal2-input" placeholder="Master password" autofocus>
            `,
            showCancelButton: true,
            confirmButtonColor: '#667eea',
            confirmButtonText: '🔓 Unlock',
            cancelButtonText: 'Cancel',
            allowOutsideClick: false,
            preConfirm: () => {
                const password = document.getElementById('swal-unlock-password').value.trim();
                
                if (!password) {
                    Swal.showValidationMessage('Please enter your password');
                    return false;
                }
                
                // Just save the password, don't verify here
                // Password will be verified when actually needed (e.g., when pushing to Bitly)
                encryption.setEncryptionPassword(password);
                return { password };
            }
        });
        
        if (!result.isConfirmed) return false;
        
        // Reload tokens - use window.bitly directly to ensure we get the latest reference
        if (window.bitly) {
            if (window.bitly.loadBitlyToken) {
                await window.bitly.loadBitlyToken();
            }
            if (window.bitly.checkBitlyToken) {
                await window.bitly.checkBitlyToken();
                // Ensure button state is updated after token check
                if (window.table && window.table.updateSelectionInfo) {
                    setTimeout(() => {
                        window.table.updateSelectionInfo();
                    }, 200);
                }
            }
        } else if (bitly) {
            // Fallback to cached reference
            if (bitly.loadBitlyToken) {
                await bitly.loadBitlyToken();
            }
            if (bitly.checkBitlyToken) {
                await bitly.checkBitlyToken();
                // Ensure button state is updated after token check
                if (window.table && window.table.updateSelectionInfo) {
                    setTimeout(() => {
                        window.table.updateSelectionInfo();
                    }, 200);
                }
            }
        }
        
        utils.showSuccess('Password saved! Password will be verified when you use encrypted features.', 'Unlocked');
        return true;
    }
    
    // Verify password when actually needed (called from other modules)
    async function verifyPasswordWhenNeeded() {
        // Use a loop to keep the dialog open on wrong password
        let passwordVerified = false;
        
        while (!passwordVerified) {
            const result = await Swal.fire({
                title: '🔒 Password Required',
                html: `
                    <p style="margin-bottom: 15px; color: #666;">Enter your master password to continue</p>
                    <input type="password" id="swal-verify-password" class="swal2-input" placeholder="Master password" autofocus>
                `,
                showCancelButton: true,
                confirmButtonColor: '#667eea',
                confirmButtonText: '🔓 Verify',
                cancelButtonText: 'Cancel',
                allowOutsideClick: false,
                preConfirm: async () => {
                    const password = document.getElementById('swal-verify-password').value.trim();
                    
                    if (!password) {
                        Swal.showValidationMessage('Please enter your password');
                        return false;
                    }
                    
                    // Verify password by trying to decrypt a test token
                    const testToken = localStorage.getItem('bitly_api_token_encrypted') || 
                                     localStorage.getItem('notion_api_token_encrypted');
                    
                    if (testToken) {
                        const decrypted = await encryption.decryptData(testToken, password);
                        if (!decrypted) {
                            Swal.showValidationMessage('<span style="color: #f56565;">❌ Incorrect password. Please try again.</span>');
                            return false;
                        }
                    }
                    
                    // Password is correct - save it
                    encryption.setEncryptionPassword(password);
                    return { password };
                }
            });
            
            // User cancelled
            if (!result.isConfirmed) {
                return false;
            }
            
            // Password verified successfully
            if (result.value && result.value.password) {
                passwordVerified = true;
                return true;
            }
        }
        
        return false;
    }

    // ========== Change Password ==========

    async function changeEncryptionPassword() {
        const result = await Swal.fire({
            title: 'Change Master Password',
            html: `
                <input type="password" id="swal-old-password" class="swal2-input" placeholder="Current password">
                <input type="password" id="swal-new-password" class="swal2-input" placeholder="New password (min 8 chars)">
                <input type="password" id="swal-new-password-confirm" class="swal2-input" placeholder="Confirm new password">
            `,
            showCancelButton: true,
            confirmButtonColor: '#667eea',
            confirmButtonText: 'Change Password',
            preConfirm: () => {
                const oldPassword = document.getElementById('swal-old-password').value;
                const newPassword = document.getElementById('swal-new-password').value;
                const newPasswordConfirm = document.getElementById('swal-new-password-confirm').value;
                
                if (!oldPassword || !newPassword || !newPasswordConfirm) {
                    Swal.showValidationMessage('All fields are required');
                    return false;
                }
                
                if (newPassword.length < 8) {
                    Swal.showValidationMessage('New password must be at least 8 characters');
                    return false;
                }
                
                if (newPassword !== newPasswordConfirm) {
                    Swal.showValidationMessage('New passwords do not match');
                    return false;
                }
                
                return { oldPassword, newPassword };
            }
        });
        
        if (!result.isConfirmed) return;
        
        const { oldPassword, newPassword } = result.value;
        
        try {
            // Verify old password
            const testToken = localStorage.getItem('bitly_api_token_encrypted') || 
                             localStorage.getItem('notion_api_token_encrypted');
            
            if (testToken) {
                const decrypted = await encryption.decryptData(testToken, oldPassword);
                if (!decrypted) {
                    utils.showError('Current password is incorrect', 'Authentication Failed');
                    return;
                }
            }
            
            // Re-encrypt with new password
            const bitlyTokenEnc = localStorage.getItem('bitly_api_token_encrypted');
            const bitlyGroupIdEnc = localStorage.getItem('bitly_group_id_encrypted');
            const notionTokenEnc = localStorage.getItem('notion_api_token_encrypted');
            const notionDbIdEnc = localStorage.getItem('notion_database_id_encrypted');
            
            if (bitlyTokenEnc) {
                const decrypted = await encryption.decryptData(bitlyTokenEnc, oldPassword);
                if (decrypted) {
                    const reencrypted = await encryption.encryptData(decrypted, newPassword);
                    localStorage.setItem('bitly_api_token_encrypted', reencrypted);
                }
            }
            
            if (bitlyGroupIdEnc) {
                const decrypted = await encryption.decryptData(bitlyGroupIdEnc, oldPassword);
                if (decrypted) {
                    const reencrypted = await encryption.encryptData(decrypted, newPassword);
                    localStorage.setItem('bitly_group_id_encrypted', reencrypted);
                }
            }
            
            if (notionTokenEnc) {
                const decrypted = await encryption.decryptData(notionTokenEnc, oldPassword);
                if (decrypted) {
                    const reencrypted = await encryption.encryptData(decrypted, newPassword);
                    localStorage.setItem('notion_api_token_encrypted', reencrypted);
                }
            }
            
            if (notionDbIdEnc) {
                const decrypted = await encryption.decryptData(notionDbIdEnc, oldPassword);
                if (decrypted) {
                    const reencrypted = await encryption.encryptData(decrypted, newPassword);
                    localStorage.setItem('notion_database_id_encrypted', reencrypted);
                }
            }
            
            // Update session password
            encryption.setEncryptionPassword(newPassword);
            
            utils.showSuccess('Master password changed successfully!', 'Password Changed');
            
        } catch (error) {
            utils.showError('Failed to change password: ' + error.message, 'Error');
        }
    }

    // Export to global scope
    window.encryptionDialog = {
        setupEncryptionDialog,
        unlockEncryptionDialog,
        changeEncryptionPassword
    };

    // Note: We don't auto-unlock on page load anymore.
    // Password will only be verified when actually needed (e.g., when pushing to Bitly).
    // Users can manually unlock by clicking the Bitly setup button if they want to view/edit settings.
})();
