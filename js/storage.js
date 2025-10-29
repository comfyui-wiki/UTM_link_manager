// ========== Storage and Import/Export Module ==========
// This module handles CSV/JSON import/export and settings management

(function() {
    'use strict';

    // Dependencies (will be set when modules load)
    let appState, utils, encryption, form, bitly;

    // Initialize dependencies
    function init() {
        appState = window.appState;
        utils = window.utils;
        encryption = window.encryption;
        form = window.form;
        bitly = window.bitly;
    }

    // Wait for DOM and dependencies
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ========== CSV Export/Import ==========

    function exportToCSV() {
        const links = appState.getLinks();
        
        if (links.length === 0) {
            utils.showWarning('No links to export', 'Export Failed');
            return;
        }

        let csv = 'Source,Medium,Campaign,Content,Base_URL,Full_URL,Short_Alias,Short_Link,Note,Status,Created_At\n';
        
        links.forEach(link => {
            csv += `"${link.source}",`;
            csv += `"${link.medium}",`;
            csv += `"${link.campaign}",`;
            csv += `"${link.content || ''}",`;
            csv += `"${link.baseUrl}",`;
            csv += `"${link.fullUrl}",`;
            csv += `"${link.shortAlias || ''}",`;
            csv += `"${link.shortLink || ''}",`;
            csv += `"${link.note || ''}",`;
            csv += `"${link.status}",`;
            csv += `"${link.createdAt}"\n`;
        });

        utils.downloadCSV(csv, `comfyui_links_${new Date().toISOString().split('T')[0]}.csv`);
    }

    function importFromCSV() {
        document.getElementById('importFileInput').click();
    }

    function handleImportFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const lines = e.target.result.split('\n');
                const links = appState.getLinks();
                let importedCount = 0;
                
                for (let i = 1; i < lines.length; i++) {
                    if (!lines[i].trim()) continue;
                    
                    const values = utils.parseCSVLine(lines[i]);
                    if (values.length < 6) continue;
                    
                    links.push({
                        id: Date.now() + i,
                        source: values[0] || '',
                        medium: values[1] || '',
                        campaign: values[2] || '',
                        content: values[3] || '',
                        baseUrl: values[4] || '',
                        fullUrl: values[5] || '',
                        shortAlias: values[6] || '',
                        shortLink: values[7] || '',
                        note: values[8] || '',
                        status: values[9] || 'pending',
                        createdAt: values[10] || new Date().toISOString()
                    });
                    importedCount++;
                }
                
                appState.setLinks(links);
                
                if (window.table && window.table.updateTable) {
                    window.table.updateTable();
                }
                if (window.table && window.table.updateStats) {
                    window.table.updateStats();
                }
                
                utils.showSuccess(`Imported ${importedCount} links successfully!`, 'Import Complete');
            } catch (error) {
                utils.showError('Import error: ' + error.message, 'Import Failed');
            }
        };
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    }

    // ========== Settings Export/Import ==========

    async function exportSettings() {
        const settings = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            encryptionEnabled: encryption.isEncryptionEnabled(),
            bitly: {
                apiToken: localStorage.getItem('bitly_api_token_encrypted') || localStorage.getItem('bitly_api_token') || null,
                groupId: localStorage.getItem('bitly_group_id_encrypted') || localStorage.getItem('bitly_group_id') || null,
                encrypted: !!localStorage.getItem('bitly_api_token_encrypted')
            },
            formState: localStorage.getItem('form_state') || null
        };

        const json = JSON.stringify(settings, null, 2);
        utils.downloadJSON(json, `utm_manager_settings_${new Date().toISOString().split('T')[0]}.json`);
        
        utils.showSuccess('Settings exported successfully!<br><br>⚠️ Keep this file secure - it contains encrypted tokens.', 'Settings Exported');
    }

    function importSettings() {
        document.getElementById('importSettingsInput').click();
    }

    async function handleImportSettings(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const settings = JSON.parse(e.target.result);
                
                if (!settings.version) {
                    utils.showError('Invalid settings file format', 'Import Failed');
                    return;
                }

                const result = await Swal.fire({
                    title: 'Import Settings',
                    html: `
                        <div style="text-align: left;">
                            <p style="margin-bottom: 15px;">Found settings exported on: <strong>${new Date(settings.exportDate).toLocaleString()}</strong></p>
                            <p style="margin-bottom: 10px;">This will import:</p>
                            <ul style="padding-left: 20px;">
                                ${settings.bitly?.apiToken ? '<li>✅ Bitly credentials</li>' : '<li>❌ No Bitly credentials</li>'}
                                ${settings.formState ? '<li>✅ Form state</li>' : '<li>❌ No form state</li>'}
                            </ul>
                            <div class="alert alert-warning" style="margin-top: 15px; font-size: 12px;">
                                ⚠️ This will overwrite your current settings!
                            </div>
                        </div>
                    `,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#667eea',
                    confirmButtonText: 'Import',
                    cancelButtonText: 'Cancel'
                });

                if (!result.isConfirmed) return;

                // Check if we need to enable encryption
                if (settings.encryptionEnabled && !encryption.isEncryptionEnabled()) {
                    if (window.encryptionDialog && window.encryptionDialog.setupEncryptionDialog) {
                        await window.encryptionDialog.setupEncryptionDialog();
                        if (!encryption.isEncryptionEnabled()) {
                            utils.showWarning('Encryption setup cancelled. Import aborted.', 'Import Cancelled');
                            return;
                        }
                    }
                }

                // Import Bitly settings
                if (settings.bitly && settings.bitly.apiToken) {
                    if (settings.bitly.encrypted) {
                        localStorage.setItem('bitly_api_token_encrypted', settings.bitly.apiToken);
                    } else {
                        localStorage.setItem('bitly_api_token', settings.bitly.apiToken);
                    }
                }
                if (settings.bitly && settings.bitly.groupId) {
                    if (settings.bitly.encrypted) {
                        localStorage.setItem('bitly_group_id_encrypted', settings.bitly.groupId);
                    } else {
                        localStorage.setItem('bitly_group_id', settings.bitly.groupId);
                    }
                }

                // Import form state
                if (settings.formState) {
                    localStorage.setItem('form_state', settings.formState);
                    if (form && form.loadFormState) {
                        form.loadFormState();
                    }
                }

                // Import encryption flag
                if (settings.encryptionEnabled) {
                    localStorage.setItem('encryption_enabled', 'true');
                }

                // Reload everything
                if (bitly && bitly.checkBitlyToken) {
                    await bitly.checkBitlyToken();
                }

                utils.showSuccess('Settings imported successfully!<br><br>If credentials were encrypted, you may need to unlock with your password.', 'Import Complete');

            } catch (error) {
                utils.showError('Failed to import settings: ' + error.message, 'Import Failed');
            }
        };
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    }

    // ========== Reset Settings ==========

    async function resetAllSettings() {
        const links = appState.getLinks();
        
        const result = await Swal.fire({
            title: '⚠️ Reset All Settings',
            html: `
                <div style="text-align: left;">
                    <p style="margin-bottom: 15px; color: #dc3545;"><strong>This will permanently delete:</strong></p>
                    <ul style="padding-left: 20px; color: #666;">
                        <li>All Bitly credentials</li>
                        <li>Encryption settings and password</li>
                        <li>Form state (source, campaign, etc.)</li>
                        <li>All generated links (${links.length} links)</li>
                    </ul>
                    <div class="alert alert-warning" style="margin-top: 15px; font-size: 13px;">
                        ⚠️ <strong>This action cannot be undone!</strong><br>
                        Consider exporting your settings first.
                    </div>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'Yes, Reset Everything',
            cancelButtonText: 'Cancel',
            input: 'checkbox',
            inputPlaceholder: 'I understand this will delete everything',
            inputValidator: (result) => {
                return !result && 'You need to confirm by checking the box'
            }
        });

        if (!result.isConfirmed) return;

        // Clear all localStorage
        localStorage.removeItem('bitly_api_token');
        localStorage.removeItem('bitly_api_token_encrypted');
        localStorage.removeItem('bitly_group_id');
        localStorage.removeItem('bitly_group_id_encrypted');
        localStorage.removeItem('encryption_enabled');
        localStorage.removeItem('form_state');
        localStorage.removeItem('comfyui_utm_links');

        // Clear session
        encryption.clearEncryptionPassword();

        // Reset state
        appState.setLinks([]);
        appState.setSelectedIndices([]);
        appState.setBitlyTokenValid(false);

        // Reset UI
        if (window.table && window.table.updateTable) {
            window.table.updateTable();
        }
        if (window.table && window.table.updateStats) {
            window.table.updateStats();
        }
        if (bitly && bitly.updateTokenStatus) {
            bitly.updateTokenStatus(false, 'No Token');
        }

        // Reset form
        document.getElementById('baseUrl').value = 'https://www.comfy.org/';
        document.getElementById('utmSource').value = '';
        document.getElementById('utmMedium').value = '';
        document.getElementById('utmCampaign').value = '';
        document.getElementById('shortPrefix').value = '';
        document.getElementById('linkNote').value = '';
        document.getElementById('batchNames').value = '';

        utils.showSuccess('All settings and data have been reset!', 'Reset Complete');
    }

    // Export to global scope
    window.storage = {
        exportToCSV,
        importFromCSV,
        handleImportFile,
        resetAllSettings
    };
})();
