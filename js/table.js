// ========== Table Management Module ==========
// This module handles table rendering, selection, and interactions

(function() {
    'use strict';

    // Dependencies (will be set when modules load)
    let appState, utils, bitly;

    // Initialize dependencies
    function init() {
        appState = window.appState;
        utils = window.utils;
        bitly = window.bitly;
    }

    // Wait for DOM and dependencies
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ========== Table Rendering ==========

    function updateTable() {
        const container = document.getElementById('tableContainer');
        const links = appState.getLinks();
        const selectedIndices = appState.getSelectedIndices();
        
        if (links.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <p>No links yet. Generate your first link above!</p>
                </div>
            `;
            return;
        }

        // Check if all links are selected
        const allSelected = links.length > 0 && links.length === selectedIndices.size;
        
        let html = '<table><thead><tr>';
        html += `<th style="width: 40px;"><input type="checkbox" ${allSelected ? 'checked' : ''} onchange="window.table.toggleSelectAll(this)"></th>`;
        html += '<th style="width: 100px;">Source</th>';
        html += '<th style="width: 140px;">Campaign</th>';
        html += '<th style="width: 120px;">Content</th>';
        html += '<th style="min-width: 350px;">Long URL</th>';
        html += '<th style="min-width: 150px;">Short Alias</th>';
        html += '<th style="width: 100px;">Mode</th>';
        html += '<th style="min-width: 120px;">Short Link</th>';
        html += '<th style="min-width: 150px;">Note</th>';
        html += '<th style="width: 80px;">Status</th>';
        html += '<th style="width: 180px;">Actions</th>';
        html += '</tr></thead><tbody>';

        links.forEach((link, index) => {
            const isSelected = selectedIndices.has(index);
            html += `<tr class="${isSelected ? 'selected' : ''}">`;
            html += `<td><input type="checkbox" ${isSelected ? 'checked' : ''} onchange="window.table.toggleSelect(${index}, this.checked)"></td>`;
            html += `<td><strong>${link.source}</strong></td>`;
            html += `<td>${link.campaign}</td>`;
            html += `<td>${link.content || '-'}</td>`;
            html += `<td><div class="link-cell">${link.fullUrl}</div></td>`;
            html += `<td><input type="text" class="note-input" value="${link.shortAlias || ''}" onchange="window.table.updateShortAliasInline(${index}, this.value)" placeholder="Enter alias"></td>`;
            html += `<td>
                <div class="mode-indicator">
                    <label class="link-mode-toggle">
                        <input type="checkbox" ${link.useCustomAlias === true ? 'checked' : ''} onchange="window.table.toggleLinkMode(${index}, this.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                    <span class="mode-label">${link.useCustomAlias === true ? 'Custom' : 'Random'}</span>
                </div>
            </td>`;
            html += `<td>${link.shortLink ? `<a href="${link.shortLink}" target="_blank" class="short-link">${link.shortLink.replace(/^https?:\/\/[^/]+\//, '')}</a>` : '<span style="color: #999;">-</span>'}</td>`;
            html += `<td><input type="text" class="note-input" value="${utils.escapeHtml(link.note || '')}" onchange="window.table.updateNote(${index}, this.value)" placeholder="Add note"></td>`;
            html += `<td><span class="status-badge ${link.shortLink ? 'created' : 'pending'}">${link.shortLink ? 'Created' : 'Pending'}</span></td>`;
            html += `<td>
                <button class="btn btn-small action-btn" onclick="window.table.copyFromTable(${index})">Copy</button>
                ${link.shortLink ? `<button class="btn btn-small action-btn" onclick="window.bitly.openBitlyStats('${link.shortLink}')" style="background: #0d6efd;">📊 Stats</button>` : ''}
                <button class="btn btn-small btn-danger action-btn" onclick="window.table.deleteLink(${index})">Del</button>
            </td>`;
            html += '</tr>';
        });

        html += '</tbody></table>';
        container.innerHTML = html;
        
        updateSelectionInfo();
    }

    // ========== Selection Management ==========

    function toggleSelect(index, checked) {
        const selectedIndices = appState.getSelectedIndices();
        if (checked) {
            selectedIndices.add(index);
        } else {
            selectedIndices.delete(index);
        }
        appState.setSelectedIndices(selectedIndices);
        updateTable();
    }

    function toggleSelectAll(checkbox) {
        const links = appState.getLinks();
        const selectedIndices = appState.getSelectedIndices();
        
        if (checkbox.checked) {
            // Select all
            links.forEach((_, index) => selectedIndices.add(index));
        } else {
            // Deselect all - create a new Set to ensure state update
            selectedIndices.clear();
        }
        
        // Create a new Set to ensure state is properly updated
        appState.setSelectedIndices(new Set(selectedIndices));
        updateTable();
    }

    function updateSelectionInfo() {
        const selectedIndices = appState.getSelectedIndices();
        const bitlyTokenValid = appState.getBitlyTokenValid();
        const count = selectedIndices.size;
        
        document.getElementById('selectionInfo').textContent = `${count} selected`;
        
        // Check if Bitly token exists (encrypted or plain)
        const hasEncryptedToken = localStorage.getItem('bitly_api_token_encrypted');
        const hasPlainToken = localStorage.getItem('bitly_api_token');
        const hasToken = hasEncryptedToken || hasPlainToken;
        
        // Show Push to Bitly button if token exists (encrypted or plain)
        // It will prompt for password when clicked if needed
        const pushBtn = document.getElementById('bulkBitlyBtn');
        if (hasToken) {
            pushBtn.style.display = 'inline-block';
            // Disable only if no selection, not based on token validation
            // Token will be verified when button is clicked
            pushBtn.disabled = count === 0;
        } else {
            pushBtn.disabled = true;
            pushBtn.style.display = 'none';
        }
        
        document.getElementById('bulkDeleteBtn').disabled = count === 0;
        
        // Update export selected button state
        const exportSelectedBtn = document.getElementById('exportSelectedBtn');
        if (exportSelectedBtn) {
            exportSelectedBtn.disabled = count === 0;
        }
    }

    // ========== Inline Editing ==========

    function updateShortAliasInline(index, value) {
        const links = appState.getLinks();
        links[index].shortAlias = value.trim();
        appState.setLinks(links);
    }

    function updateNote(index, value) {
        const links = appState.getLinks();
        links[index].note = value.trim();
        appState.setLinks(links);
    }

    function toggleLinkMode(index, useCustom) {
        const links = appState.getLinks();
        links[index].useCustomAlias = useCustom;
        appState.setLinks(links);
        updateTable();
    }

    // ========== Actions ==========

    function copyFromTable(index) {
        const links = appState.getLinks();
        const link = links[index];
        const text = link.shortLink || link.fullUrl;
        navigator.clipboard.writeText(text).then(() => {
            utils.Toast.fire({
                icon: 'success',
                title: 'Copied to clipboard!'
            });
        });
    }

    async function deleteLink(index) {
        const links = appState.getLinks();
        const selectedIndices = appState.getSelectedIndices();
        const link = links[index];
        const hasBitlyLink = !!link.shortLink;
        
        let deleteBitly = false;
        
        if (hasBitlyLink) {
            const result = await Swal.fire({
                title: 'Delete Link',
                html: `
                    <p>Are you sure you want to delete this link?</p>
                    <div style="margin-top: 15px; text-align: left; padding: 10px; background: #f8f9fa; border-radius: 4px;">
                        <label style="cursor: pointer; display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" id="deleteBitlyCheckbox" style="width: auto; cursor: pointer;">
                            <span>Also delete Bitly short link: <strong>${link.shortLink.replace('https://links.comfy.org/', '')}</strong></span>
                        </label>
                    </div>
                `,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
                preConfirm: () => {
                    deleteBitly = document.getElementById('deleteBitlyCheckbox').checked;
                }
            });
            
            if (!result.isConfirmed) return;
        } else {
            if (!await utils.showConfirm('Are you sure you want to delete this link?', 'Delete Link')) {
                return;
            }
        }
        
        // Delete from Bitly if requested
        if (deleteBitly && hasBitlyLink) {
            const bitlyResult = await bitly.deleteBitlyShortLink(link.shortLink);
            if (!bitlyResult.success) {
                utils.showWarning(`Link deleted from manager, but failed to delete from Bitly: ${bitlyResult.error}`, 'Partial Delete');
            }
        }
        
        // Delete from local storage
        appState.removeLink(index);
        selectedIndices.delete(index);
        appState.setSelectedIndices(selectedIndices);
        updateTable();
        updateStats();
        
        if (deleteBitly && hasBitlyLink) {
            utils.showSuccess('Link deleted from manager and Bitly');
        } else {
            utils.showSuccess('Link deleted successfully');
        }
    }

    async function deleteSelected() {
        const selectedIndices = appState.getSelectedIndices();
        const links = appState.getLinks();
        
        if (selectedIndices.size === 0) return;
        
        const selectedLinks = Array.from(selectedIndices).map(i => links[i]);
        const withBitlyLinks = selectedLinks.filter(l => l.shortLink);
        
        let deleteBitly = false;
        
        if (withBitlyLinks.length > 0) {
            const result = await Swal.fire({
                title: 'Delete Selected Links',
                html: `
                    <p>Are you sure you want to delete <strong>${selectedIndices.size}</strong> selected link${selectedIndices.size > 1 ? 's' : ''}?</p>
                    <div style="margin-top: 15px; text-align: left; padding: 10px; background: #f8f9fa; border-radius: 4px;">
                        <label style="cursor: pointer; display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" id="deleteBitlyCheckboxBatch" style="width: auto; cursor: pointer;">
                            <span>Also delete <strong>${withBitlyLinks.length}</strong> Bitly short link${withBitlyLinks.length > 1 ? 's' : ''}</span>
                        </label>
                    </div>
                `,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
                preConfirm: () => {
                    deleteBitly = document.getElementById('deleteBitlyCheckboxBatch').checked;
                }
            });
            
            if (!result.isConfirmed) return;
        } else {
            if (!await utils.showConfirm(`Are you sure you want to delete ${selectedIndices.size} selected link${selectedIndices.size > 1 ? 's' : ''}?`, 'Delete Selected Links')) {
                return;
            }
        }
        
        // Delete from Bitly if requested
        if (deleteBitly && withBitlyLinks.length > 0) {
            Swal.fire({
                title: 'Deleting from Bitly...',
                html: `Progress: <strong>0</strong>/${withBitlyLinks.length}`,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            let bitlyDeletedCount = 0;
            let bitlyFailedCount = 0;
            
            for (let i = 0; i < withBitlyLinks.length; i++) {
                Swal.update({
                    html: `Progress: <strong>${i + 1}</strong>/${withBitlyLinks.length}`
                });
                
                const result = await bitly.deleteBitlyShortLink(withBitlyLinks[i].shortLink);
                if (result.success) {
                    bitlyDeletedCount++;
                } else {
                    bitlyFailedCount++;
                }
                
                if (i < withBitlyLinks.length - 1) {
                    await utils.sleep(400);
                }
            }
            
            Swal.close();
            
            if (bitlyFailedCount > 0) {
                utils.showWarning(`${bitlyDeletedCount} deleted from Bitly, ${bitlyFailedCount} failed`, 'Partial Bitly Delete');
            }
        }
        
        // Delete from local storage (delete in reverse order to maintain indices)
        const indicesToDelete = Array.from(selectedIndices).sort((a, b) => b - a);
        indicesToDelete.forEach(index => appState.removeLink(index));
        selectedIndices.clear();
        appState.setSelectedIndices(selectedIndices);
        updateTable();
        updateStats();
        
        if (deleteBitly && withBitlyLinks.length > 0) {
            utils.showSuccess(`${indicesToDelete.length} link${indicesToDelete.length > 1 ? 's' : ''} deleted from manager and Bitly`);
        } else {
            utils.showSuccess(`${indicesToDelete.length} link${indicesToDelete.length > 1 ? 's' : ''} deleted successfully`);
        }
    }

    // ========== Statistics ==========

    function updateStats() {
        const links = appState.getLinks();
        const total = links.length;
        const withShort = links.filter(l => l.shortLink).length;
        
        document.getElementById('headerTotal').textContent = total;
        document.getElementById('headerShort').textContent = withShort;
    }

    // Export to global scope
    window.table = {
        updateTable,
        toggleSelect,
        toggleSelectAll,
        updateSelectionInfo,
        updateShortAliasInline,
        updateNote,
        toggleLinkMode,
        copyFromTable,
        deleteLink,
        deleteSelected,
        updateStats
    };
})();
