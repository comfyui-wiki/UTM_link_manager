// ========== Global State Configuration ==========
// This module manages global application state

// Internal state
let _links = JSON.parse(localStorage.getItem('comfyui_utm_links') || '[]');
let _selectedIndices = new Set();
let _bitlyTokenValid = false;

// Export state getters/setters with synchronization
window.appState = {
    getLinks: () => _links,
    setLinks: (newLinks) => {
        _links = newLinks;
        if (window.links) window.links = _links; // Sync with global
        localStorage.setItem('comfyui_utm_links', JSON.stringify(_links));
    },
    addLinks: (newLinks) => {
        _links.unshift(...newLinks);
        if (window.links) window.links = _links; // Sync with global
        localStorage.setItem('comfyui_utm_links', JSON.stringify(_links));
    },
    removeLink: (index) => {
        _links.splice(index, 1);
        if (window.links) window.links = _links; // Sync with global
        localStorage.setItem('comfyui_utm_links', JSON.stringify(_links));
    },
    updateLink: (index, updates) => {
        _links[index] = { ..._links[index], ...updates };
        if (window.links) window.links = _links; // Sync with global
        localStorage.setItem('comfyui_utm_links', JSON.stringify(_links));
    },
    getSelectedIndices: () => _selectedIndices,
    setSelectedIndices: (indices) => {
        _selectedIndices = indices instanceof Set ? indices : new Set(indices);
        if (window.selectedIndices) window.selectedIndices = _selectedIndices; // Sync
    },
    getBitlyTokenValid: () => _bitlyTokenValid,
    setBitlyTokenValid: (valid) => {
        _bitlyTokenValid = valid;
        if (window.bitlyTokenValid !== undefined) window.bitlyTokenValid = valid; // Sync
    },
};

// Create global variables for backward compatibility
window.links = _links;
window.selectedIndices = _selectedIndices;
window.bitlyTokenValid = _bitlyTokenValid;

