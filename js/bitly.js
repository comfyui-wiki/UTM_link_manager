// ========== Bitly Integration Module ==========
// This module handles all Bitly API interactions

(function() {
    'use strict';

    // Dependencies (will be set when modules load)
    let appState, encryption, utils;

    // Initialize dependencies
    function init() {
        appState = window.appState;
        encryption = window.encryption;
        utils = window.utils;
    }

    // Wait for DOM and dependencies
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ========== Token Management ==========

    async function checkBitlyToken() {
        let token = null;
        const password = encryption.getEncryptionPassword();
        
        if (encryption.isEncryptionEnabled() && password) {
            const encrypted = localStorage.getItem('bitly_api_token_encrypted');
            if (encrypted) {
                token = await encryption.decryptData(encrypted, password);
            }
        } else if (!encryption.isEncryptionEnabled()) {
            token = localStorage.getItem('bitly_api_token');
        }
        
        if (!token) {
            appState.setBitlyTokenValid(false);
            updateTokenStatus(false, 'No Token');
            return;
        }

        try {
            const response = await fetch('https://api-ssl.bitly.com/v4/user', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                appState.setBitlyTokenValid(true);
                const data = await response.json();
                updateTokenStatus(true, data.login || 'Connected');
            } else {
                appState.setBitlyTokenValid(false);
                updateTokenStatus(false, 'Invalid Token');
            }
        } catch (error) {
            appState.setBitlyTokenValid(false);
            updateTokenStatus(false, 'Connection Error');
        }
    }

    function updateTokenStatus(valid, text) {
        const setupBtn = document.getElementById('bitlySetupBtn');
        const pushBtn = document.getElementById('bulkBitlyBtn');
        
        if (!setupBtn || !pushBtn) {
            // DOM elements not ready yet, try again later
            setTimeout(() => updateTokenStatus(valid, text), 100);
            return;
        }
        
        if (valid) {
            setupBtn.innerHTML = '✅ Bitly';
            setupBtn.className = 'btn btn-small btn-success';
            pushBtn.style.display = 'inline-block';
        } else {
            setupBtn.innerHTML = '⚠️ Bitly';
            setupBtn.className = 'btn btn-small btn-warning';
            pushBtn.style.display = 'none';
        }
        
        // Call updateSelectionInfo if it exists (from table.js)
        // This ensures the button is enabled/disabled based on selection
        if (window.table && window.table.updateSelectionInfo) {
            window.table.updateSelectionInfo();
        }
    }

    // ========== Panel Management ==========

    async function showBitlyPanel() {
        // Check if encryption is enabled first
        if (!encryption.isEncryptionEnabled()) {
            if (window.encryptionDialog && window.encryptionDialog.setupEncryptionDialog) {
                await window.encryptionDialog.setupEncryptionDialog();
                if (!encryption.isEncryptionEnabled()) {
                    return;
                }
            }
        }
        
        const panel = document.getElementById('bitlyPanel');
        
        // Check if encryption is enabled but not unlocked
        if (encryption.isEncryptionEnabled() && !encryption.getEncryptionPassword()) {
            // Auto-unlock: prompt user to unlock before showing panel
            if (window.encryptionDialog && window.encryptionDialog.unlockEncryptionDialog) {
                const unlocked = await window.encryptionDialog.unlockEncryptionDialog();
                if (!unlocked) {
                    // User cancelled unlock, don't show panel
                    return;
                }
                // After unlocking, re-check token status
                await checkBitlyToken();
            } else {
                // Fallback: show locked state
                panel.innerHTML = `
                    <h4>⚙️ Bitly Setup</h4>
                    <div class="alert alert-warning" style="margin-bottom: 15px;">
                        🔒 <strong>Content Hidden:</strong> Your Bitly credentials are encrypted. Please unlock to view and edit.
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn btn-small" onclick="window.bitly.unlockAndReloadBitlyPanel()">🔓 Unlock</button>
                        <button class="btn btn-small btn-secondary" onclick="window.bitly.hideBitlyPanel()">Close</button>
                    </div>
                `;
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                return;
            }
        }
        
        // Load normal panel content
        await loadBitlyPanelContent();
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
    
    async function loadBitlyPanelContent() {
        const panel = document.getElementById('bitlyPanel');
        panel.innerHTML = `
            <h4>⚙️ Bitly Setup</h4>
            <div class="help-text" style="margin-bottom: 15px; color: #856404;">
                Get token: <a href="https://bitly.com" target="_blank" style="color: #667eea;">bitly.com</a> → Settings → Developer Settings → API
            </div>
            <div class="alert alert-info" style="margin-bottom: 15px; font-size: 12px;">
                🔒 <strong>Encrypted & Secure:</strong> Your credentials are encrypted with AES-256 and stored locally in your browser. Your master password is never saved. Data stays on your device only.
            </div>
            <div class="form-group">
                <label for="bitlyApiToken">API Token</label>
                <input type="text" id="bitlyApiToken" placeholder="Paste your API token" style="margin-bottom: 10px;">
            </div>
            <div class="form-group">
                <label for="bitlyGroupId">Group ID (for analytics)</label>
                <input type="text" id="bitlyGroupId" placeholder="Your group ID" style="margin-bottom: 10px;">
                <div class="help-text" style="margin-top: 5px;">
                    Find in Bitly dashboard URL: <code>app.bitly.com/<strong>YOUR_GROUP_ID</strong>/links/...</code>
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="btn btn-small" onclick="window.bitly.verifyAndSaveBitlyToken()">✅ Verify</button>
                <button class="btn btn-small btn-danger" onclick="window.bitly.clearBitlyToken()">🗑️ Clear</button>
                <button class="btn btn-small btn-warning" onclick="window.encryptionDialog.changeEncryptionPassword()">🔑 Change Password</button>
                <button class="btn btn-small btn-secondary" onclick="window.bitly.hideBitlyPanel()">Close</button>
            </div>
        `;
        
        await loadBitlyToken();
    }
    
    async function unlockAndReloadBitlyPanel() {
        if (window.encryptionDialog && window.encryptionDialog.unlockEncryptionDialog) {
            const unlocked = await window.encryptionDialog.unlockEncryptionDialog();
            if (unlocked) {
                await loadBitlyPanelContent();
                // Re-check token status after unlocking
                await checkBitlyToken();
            }
        }
    }

    function hideBitlyPanel() {
        document.getElementById('bitlyPanel').style.display = 'none';
    }

    // ========== Token Storage ==========

    async function loadBitlyToken() {
        // Check if the panel elements exist before trying to set values
        const tokenInput = document.getElementById('bitlyApiToken');
        const groupIdInput = document.getElementById('bitlyGroupId');
        
        if (!tokenInput || !groupIdInput) {
            // Panel not loaded yet, elements don't exist
            return;
        }
        
        const password = encryption.getEncryptionPassword();
        
        if (encryption.isEncryptionEnabled() && password) {
            // Load encrypted token
            const encrypted = localStorage.getItem('bitly_api_token_encrypted');
            if (encrypted) {
                const decrypted = await encryption.decryptData(encrypted, password);
                if (decrypted && tokenInput) {
                    tokenInput.value = decrypted;
                }
            }
            // Load encrypted Group ID
            const encryptedGroupId = localStorage.getItem('bitly_group_id_encrypted');
            if (encryptedGroupId) {
                const decrypted = await encryption.decryptData(encryptedGroupId, password);
                if (decrypted && groupIdInput) {
                    groupIdInput.value = decrypted;
                }
            }
        } else if (!encryption.isEncryptionEnabled()) {
            // Load plain text token
            const saved = localStorage.getItem('bitly_api_token');
            if (saved && tokenInput) {
                tokenInput.value = saved;
            }
            // Load plain text Group ID
            const savedGroupId = localStorage.getItem('bitly_group_id');
            if (savedGroupId && groupIdInput) {
                groupIdInput.value = savedGroupId;
            }
        }
    }

    async function saveBitlyToken() {
        const token = document.getElementById('bitlyApiToken').value.trim();
        const groupId = document.getElementById('bitlyGroupId').value.trim();
        const password = encryption.getEncryptionPassword();
        
        if (encryption.isEncryptionEnabled() && password) {
            // Save encrypted
            if (token) {
                const encrypted = await encryption.encryptData(token, password);
                localStorage.setItem('bitly_api_token_encrypted', encrypted);
                localStorage.removeItem('bitly_api_token'); // Remove plain text
            }
            if (groupId) {
                const encrypted = await encryption.encryptData(groupId, password);
                localStorage.setItem('bitly_group_id_encrypted', encrypted);
                localStorage.removeItem('bitly_group_id'); // Remove plain text
            }
        } else {
            // Save plain text
            if (token) {
                localStorage.setItem('bitly_api_token', token);
            }
            if (groupId) {
                localStorage.setItem('bitly_group_id', groupId);
            }
        }
    }

    async function clearBitlyToken() {
        if (await utils.showConfirm('Remove saved Bitly credentials? You will need to re-enter them next time.', 'Clear Bitly Setup')) {
            localStorage.removeItem('bitly_api_token');
            localStorage.removeItem('bitly_api_token_encrypted');
            localStorage.removeItem('bitly_group_id');
            localStorage.removeItem('bitly_group_id_encrypted');
            document.getElementById('bitlyApiToken').value = '';
            document.getElementById('bitlyGroupId').value = '';
            appState.setBitlyTokenValid(false);
            updateTokenStatus(false, 'No Token');
            utils.showSuccess('Bitly credentials cleared successfully!');
        }
    }

    async function verifyAndSaveBitlyToken() {
        const apiToken = document.getElementById('bitlyApiToken').value.trim();
        
        if (!apiToken) {
            utils.showError('Please enter API token', 'Token Required');
            return;
        }

        // Show loading
        Swal.fire({
            title: 'Verifying Token...',
            text: 'Please wait',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const response = await fetch('https://api-ssl.bitly.com/v4/user', {
                headers: { 'Authorization': `Bearer ${apiToken}` }
            });

            if (response.ok) {
                const data = await response.json();
                await saveBitlyToken();
                appState.setBitlyTokenValid(true);
                updateTokenStatus(true, data.login || 'Connected');
                hideBitlyPanel();
                
                // Ensure button state is updated after verification
                if (window.table && window.table.updateSelectionInfo) {
                    window.table.updateSelectionInfo();
                }
                
                Swal.fire({
                    icon: 'success',
                    title: 'Token Verified!',
                    html: `Token saved successfully<br><br>Logged in as: <strong>${data.login || data.name}</strong>`,
                    confirmButtonColor: '#667eea'
                });
            } else {
                appState.setBitlyTokenValid(false);
                updateTokenStatus(false, 'Invalid Token');
                utils.showError('Invalid token. Please check and try again.', 'Verification Failed');
            }
        } catch (error) {
            appState.setBitlyTokenValid(false);
            updateTokenStatus(false, 'Connection Error');
            utils.showError('Connection error: ' + error.message, 'Connection Failed');
        }
    }

    // ========== Short Link Creation ==========

    async function createBitlyForSelected() {
        let apiToken = null;
        let password = encryption.getEncryptionPassword();
        const links = appState.getLinks();
        const selectedIndices = appState.getSelectedIndices();
        const bitlyTokenValid = appState.getBitlyTokenValid();
        
        // If encryption is enabled, verify password before proceeding
        if (encryption.isEncryptionEnabled()) {
            const encrypted = localStorage.getItem('bitly_api_token_encrypted');
            if (encrypted) {
                // Try to decrypt with current password (if any)
                if (password) {
                    apiToken = await encryption.decryptData(encrypted, password);
                }
                
                // If decryption failed (wrong password or no password), ask for password
                if (!apiToken) {
                    // Call password verification dialog (with error handling in dialog)
                    if (window.encryptionDialog && window.encryptionDialog.verifyPasswordWhenNeeded) {
                        const verified = await window.encryptionDialog.verifyPasswordWhenNeeded();
                        if (!verified) {
                            // User cancelled password verification
                            return;
                        }
                        // Get the password that was just verified and saved
                        password = encryption.getEncryptionPassword();
                        // Try decrypting again
                        if (password) {
                            apiToken = await encryption.decryptData(encrypted, password);
                        }
                    } else {
                        // Fallback: show error
                        utils.showError('Password verification is required but verification dialog is not available.', 'Verification Error');
                        return;
                    }
                }
            }
        } else {
            // No encryption, use plain token
            apiToken = localStorage.getItem('bitly_api_token');
        }
        
        if (!apiToken || !bitlyTokenValid) {
            utils.showWarning('Please set up and verify Bitly API token first (click "⚙️ Setup Token" button)', 'Token Required');
            showBitlyPanel();
            return;
        }

        const selectedLinks = Array.from(selectedIndices)
            .map(i => ({ ...links[i], originalIndex: i }))
            .filter(l => !l.shortLink);

        if (selectedLinks.length === 0) {
            utils.showInfo('Selected links already have short links.', 'No Links to Create');
            return;
        }

        // Check for missing aliases in custom mode links
        const customLinks = selectedLinks.filter(l => l.useCustomAlias === true);
        const missingAlias = customLinks.filter(l => !l.shortAlias);
        if (missingAlias.length > 0) {
            utils.showWarning(`${missingAlias.length} link(s) using Custom mode are missing short alias.<br><br>Please:<br>1. Add alias in table, OR<br>2. Switch those links to Random mode (toggle switch)`, 'Missing Aliases');
            return;
        }

        const customCount = selectedLinks.filter(l => l.useCustomAlias === true).length;
        const randomCount = selectedLinks.length - customCount;
        let modeText = '';
        if (customCount > 0 && randomCount > 0) {
            modeText = `${customCount} custom + ${randomCount} random`;
        } else if (customCount > 0) {
            modeText = 'custom aliases';
        } else {
            modeText = 'random codes';
        }
        
        if (!await utils.showConfirm(`Create ${selectedLinks.length} short link${selectedLinks.length > 1 ? 's' : ''} (${modeText})?`, 'Create Short Links')) {
            return;
        }

        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        // Show progress modal
        Swal.fire({
            title: 'Creating Short Links',
            html: `Progress: <strong>0</strong>/${selectedLinks.length}`,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        for (let i = 0; i < selectedLinks.length; i++) {
            const link = selectedLinks[i];
            
            // Update progress
            Swal.update({
                html: `Progress: <strong>${i + 1}</strong>/${selectedLinks.length}<br>Current: ${link.shortAlias || 'random'}`
            });

            const result = await createBitlyShortLink(apiToken, link);
            
            if (result.success) {
                appState.updateLink(link.originalIndex, { 
                    shortLink: result.shortLink,
                    status: 'created'
                });
                successCount++;
            } else {
                errorCount++;
                errors.push({ alias: link.shortAlias || 'random', error: result.error });
            }

            if (i < selectedLinks.length - 1) {
                await utils.sleep(600);
            }
        }

        selectedIndices.clear();
        if (window.table && window.table.updateTable) {
            window.table.updateTable();
        }
        if (window.table && window.table.updateStats) {
            window.table.updateStats();
        }
        
        // Show results
        let resultHtml = `<div style="text-align: left;">
            <p><strong>✅ Success:</strong> ${successCount}</p>
            <p><strong>❌ Failed:</strong> ${errorCount}</p>`;
        
        if (errors.length > 0 && errors.length <= 5) {
            resultHtml += '<br><p><strong>Errors:</strong></p><ul style="text-align: left;">';
            errors.forEach(e => {
                resultHtml += `<li>${e.alias}: ${e.error}</li>`;
            });
            resultHtml += '</ul>';
        } else if (errors.length > 5) {
            resultHtml += `<br><p><em>Too many errors to display (${errors.length} total)</em></p>`;
        }
        resultHtml += '</div>';
        
        Swal.fire({
            icon: successCount > 0 && errorCount === 0 ? 'success' : 'warning',
            title: 'Complete!',
            html: resultHtml,
            confirmButtonColor: '#667eea'
        });
    }

    async function createBitlyShortLink(apiToken, link) {
        const payload = {
            long_url: link.fullUrl,
            domain: 'links.comfy.org'
        };

        // Add custom keyword only if this specific link uses custom mode AND has an alias
        if (link.useCustomAlias === true && link.shortAlias) {
            payload.keyword = link.shortAlias;  // Use 'keyword' parameter for custom aliases
            console.log(`Creating CUSTOM short link with keyword: ${link.shortAlias}`);
        } else {
            console.log(`Creating RANDOM short link for: ${link.fullUrl}`);
        }

        console.log('📤 Bitly API Request Payload:', JSON.stringify(payload, null, 2));

        try {
            // Use /v4/bitlinks endpoint instead of /v4/shorten for custom keywords
            const response = await fetch('https://api-ssl.bitly.com/v4/bitlinks', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            console.log('📥 Bitly API Response Status:', response.status);

            const data = await response.json();
            console.log('📥 Bitly API Response Data:', JSON.stringify(data, null, 2));

            if (response.ok) {
                return { success: true, shortLink: data.link };
            } else {
                return { success: false, error: data.message || data.description || 'Unknown error' };
            }
        } catch (error) {
            console.error('❌ Bitly API Error:', error);
            return { success: false, error: error.message };
        }
    }

    // ========== Bitly Management ==========

    async function openBitlyStats(shortLink) {
        // Get Group ID from localStorage
        let groupId = null;
        const password = encryption.getEncryptionPassword();
        
        if (encryption.isEncryptionEnabled() && password) {
            const encrypted = localStorage.getItem('bitly_group_id_encrypted');
            if (encrypted) {
                groupId = await encryption.decryptData(encrypted, password);
            }
        } else {
            groupId = localStorage.getItem('bitly_group_id');
        }
        
        if (!groupId) {
            utils.showWarning('Please set up Bitly Group ID first in Bitly Setup panel to view analytics.', 'Group ID Required');
            showBitlyPanel();
            return;
        }
        
        // Extract the bitlink ID
        // e.g., "https://links.comfy.org/twitter" -> "links.comfy.org/twitter"
        const bitlinkId = shortLink.replace('https://', '').replace('http://', '');
        
        // Open Bitly analytics page with Group ID
        // Format: https://app.bitly.com/{GROUP_ID}/links/{bitlink_id}/details
        const statsUrl = `https://app.bitly.com/${groupId}/links/${bitlinkId}/details`;
        
        console.log('📊 Opening Bitly stats:', statsUrl);
        window.open(statsUrl, '_blank');
    }

    async function deleteBitlyShortLink(shortLink) {
        let apiToken = null;
        const password = encryption.getEncryptionPassword();
        
        if (encryption.isEncryptionEnabled() && password) {
            const encrypted = localStorage.getItem('bitly_api_token_encrypted');
            if (encrypted) {
                apiToken = await encryption.decryptData(encrypted, password);
            }
        } else {
            apiToken = localStorage.getItem('bitly_api_token');
        }
        
        if (!apiToken) {
            return { success: false, error: 'No Bitly API token' };
        }
        
        // Extract bitlink ID from URL
        // e.g., "https://links.comfy.org/twitter" -> "links.comfy.org/twitter"
        const bitlinkId = shortLink.replace('https://', '').replace('http://', '');
        
        console.log('🗑️ Deleting Bitly short link:', bitlinkId);
        
        try {
            const response = await fetch(`https://api-ssl.bitly.com/v4/bitlinks/${encodeURIComponent(bitlinkId)}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('📥 Bitly Delete Response Status:', response.status);
            
            if (response.ok || response.status === 200) {
                return { success: true };
            } else {
                const data = await response.json();
                console.log('📥 Bitly Delete Error:', data);
                return { success: false, error: data.message || data.description || 'Unknown error' };
            }
        } catch (error) {
            console.error('❌ Bitly Delete Error:', error);
            return { success: false, error: error.message };
        }
    }

    // Export to global scope
    window.bitly = {
        checkBitlyToken,
        updateTokenStatus,
        showBitlyPanel,
        loadBitlyPanelContent,
        unlockAndReloadBitlyPanel,
        hideBitlyPanel,
        loadBitlyToken,
        saveBitlyToken,
        clearBitlyToken,
        verifyAndSaveBitlyToken,
        createBitlyForSelected,
        createBitlyShortLink,
        openBitlyStats,
        deleteBitlyShortLink
    };
})();
