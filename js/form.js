// ========== Form Management Module ==========
// This module handles form state, validation, and link generation

(function() {
    'use strict';

    // Dependencies (will be set when modules load)
    let appState, utils;

    // Initialize dependencies
    function init() {
        appState = window.appState;
        utils = window.utils;
    }

    // Wait for DOM and dependencies
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ========== Form State Management ==========

    function saveFormState() {
        const formState = {
            baseUrl: document.getElementById('baseUrl').value,
            utmSource: document.getElementById('utmSource').value,
            utmSourceCustom: document.getElementById('utmSourceCustom').value,
            utmMedium: document.getElementById('utmMedium').value,
            utmMediumCustom: document.getElementById('utmMediumCustom').value,
            utmCampaign: document.getElementById('utmCampaign').value,
            shortPrefix: document.getElementById('shortPrefix').value,
            linkNote: document.getElementById('linkNote').value,
            batchNames: document.getElementById('batchNames').value,
            defaultLinkMode: document.querySelector('input[name="defaultLinkMode"]:checked').value
        };
        localStorage.setItem('form_state', JSON.stringify(formState));
    }

    function loadFormState() {
        const saved = localStorage.getItem('form_state');
        if (!saved) return;
        
        try {
            const formState = JSON.parse(saved);
            
            if (formState.baseUrl) document.getElementById('baseUrl').value = formState.baseUrl;
            if (formState.utmSource) document.getElementById('utmSource').value = formState.utmSource;
            if (formState.utmSourceCustom) document.getElementById('utmSourceCustom').value = formState.utmSourceCustom;
            if (formState.utmMedium) document.getElementById('utmMedium').value = formState.utmMedium;
            if (formState.utmMediumCustom) document.getElementById('utmMediumCustom').value = formState.utmMediumCustom;
            if (formState.utmCampaign) document.getElementById('utmCampaign').value = formState.utmCampaign;
            if (formState.shortPrefix) document.getElementById('shortPrefix').value = formState.shortPrefix;
            if (formState.linkNote) document.getElementById('linkNote').value = formState.linkNote;
            if (formState.batchNames) document.getElementById('batchNames').value = formState.batchNames;
            
            if (formState.defaultLinkMode) {
                document.querySelectorAll('input[name="defaultLinkMode"]').forEach(radio => {
                    radio.checked = radio.value === formState.defaultLinkMode;
                });
            }
            
            // Restore custom input visibility and batch indicators
            if (formState.utmSource === 'other' && formState.utmSourceCustom) {
                document.getElementById('utmSourceCustom').style.display = 'block';
                updateSourceBatchIndicator();
            }
            if (formState.utmMedium === 'other' && formState.utmMediumCustom) {
                document.getElementById('utmMediumCustom').style.display = 'block';
                updateMediumBatchIndicator();
            }
            
            // Update short alias if source is loaded
            if (formState.utmSource) {
                updateShortAlias();
            }
            
            // Update batch indicator if names are loaded
            if (formState.batchNames) {
                updateBatchIndicator();
            }
        } catch (error) {
            console.error('Error loading form state:', error);
        }
    }

    function clearNamesField() {
        document.getElementById('batchNames').value = '';
        updateBatchIndicator();
        saveFormState();
    }

    // ========== Form Validation & Indicators ==========

    function updateBatchIndicator() {
        const names = document.getElementById('batchNames').value.trim();
        const indicator = document.getElementById('batchIndicator');
        const countSpan = document.getElementById('batchCount');
        
        if (!names) {
            indicator.style.display = 'none';
            return;
        }
        
        const count = names.split('\n').filter(n => n.trim()).length;
        countSpan.textContent = count;
        indicator.style.display = 'block';
    }

    function handleSourceChange() {
        const sourceSelect = document.getElementById('utmSource');
        const sourceCustom = document.getElementById('utmSourceCustom');
        const indicator = document.getElementById('sourceBatchIndicator');
        
        if (sourceSelect.value === 'other') {
            sourceCustom.style.display = 'block';
            sourceCustom.focus();
        } else {
            sourceCustom.style.display = 'none';
            sourceCustom.value = '';
            indicator.style.display = 'none';
        }
        
        updateShortAlias();
    }

    function handleMediumChange() {
        const mediumSelect = document.getElementById('utmMedium');
        const mediumCustom = document.getElementById('utmMediumCustom');
        const indicator = document.getElementById('mediumBatchIndicator');
        
        if (mediumSelect.value === 'other') {
            mediumCustom.style.display = 'block';
            mediumCustom.focus();
        } else {
            mediumCustom.style.display = 'none';
            mediumCustom.value = '';
            indicator.style.display = 'none';
        }
    }

    function updateSourceBatchIndicator() {
        const sourceCustom = document.getElementById('utmSourceCustom').value.trim();
        const indicator = document.getElementById('sourceBatchIndicator');
        
        if (!sourceCustom) {
            indicator.style.display = 'none';
            return;
        }
        
        const sources = sourceCustom.split('\n').filter(s => s.trim());
        if (sources.length > 1) {
            indicator.textContent = `📦 Batch: ${sources.length} sources`;
            indicator.style.display = 'block';
        } else {
            indicator.style.display = 'none';
        }
        
        updateShortAlias();
    }

    function updateMediumBatchIndicator() {
        const mediumCustom = document.getElementById('utmMediumCustom').value.trim();
        const indicator = document.getElementById('mediumBatchIndicator');
        
        if (!mediumCustom) {
            indicator.style.display = 'none';
            return;
        }
        
        const mediums = mediumCustom.split('\n').filter(m => m.trim());
        if (mediums.length > 1) {
            indicator.textContent = `📦 Batch: ${mediums.length} mediums`;
            indicator.style.display = 'block';
        } else {
            indicator.style.display = 'none';
        }
    }

    // ========== Value Getters ==========

    function getSourceValues() {
        const sourceSelect = document.getElementById('utmSource').value;
        const sourceCustom = document.getElementById('utmSourceCustom').value.trim();
        
        if (sourceSelect === 'other' && sourceCustom) {
            return sourceCustom.split('\n').map(s => s.trim()).filter(s => s);
        }
        return sourceSelect ? [sourceSelect] : [];
    }

    function getMediumValues() {
        const mediumSelect = document.getElementById('utmMedium').value;
        const mediumCustom = document.getElementById('utmMediumCustom').value.trim();
        
        if (mediumSelect === 'other' && mediumCustom) {
            return mediumCustom.split('\n').map(m => m.trim()).filter(m => m);
        }
        return mediumSelect ? [mediumSelect] : [''];
    }

    function getSourceValue() {
        const values = getSourceValues();
        return values.length > 0 ? values[0] : '';
    }

    function getMediumValue() {
        const values = getMediumValues();
        return values.length > 0 ? values[0] : '';
    }

    // ========== Short Alias Generation ==========

    function updateShortAlias() {
        const source = getSourceValue();
        const baseUrl = document.getElementById('baseUrl').value;
        
        if (!source) return;
        
        const shortMap = {
            'twitter': 'tw', 'discord': 'dc', 'youtube': 'yt', 'linkedin': 'li',
            'reddit': 'rd', 'instagram': 'ig', 'facebook': 'fb', 'bilibili': 'bili',
            'wechat': 'wx', 'wechat_group': 'wxg', 'weibo': 'wb', 
            'xiaohongshu': 'xhs', 'zhihu': 'zh', 'douyin': 'dy', 'github': 'gh'
        };
        
        let suffix = '';
        if (baseUrl.includes('download')) suffix = '-dl';
        else if (baseUrl.includes('cloud')) suffix = '-cloud';
        else if (baseUrl.includes('docs')) suffix = '-docs';
        else if (baseUrl.includes('blog')) suffix = '-blog';
        else if (baseUrl.includes('tutorials')) suffix = '-tut';
        
        const prefix = (shortMap[source] || source.substring(0, 4)) + suffix;
        document.getElementById('shortPrefix').value = prefix;
    }

    // ========== Link Generation ==========

    function generateLinks() {
        const baseUrl = document.getElementById('baseUrl').value.trim();
        const sources = getSourceValues();
        const mediums = getMediumValues();
        const campaign = document.getElementById('utmCampaign').value;
        const namesInput = document.getElementById('batchNames').value.trim();
        const shortPrefix = document.getElementById('shortPrefix').value.trim();

        if (!baseUrl || sources.length === 0) {
            utils.showError('Please fill in: Destination URL and Platform', 'Missing Required Fields');
            return;
        }

        const names = namesInput ? namesInput.split('\n').map(n => n.trim()).filter(n => n) : [''];
        const links = appState.getLinks();
        
        const newLinks = [];
        const duplicates = [];
        
        let linkIndex = 0;
        
        // Create cartesian product: sources × mediums × names
        sources.forEach(source => {
            mediums.forEach(medium => {
                names.forEach(name => {
                    const params = new URLSearchParams();
                    params.append('utm_source', source);
                    
                    // Only add medium if it has a value
                    if (medium) {
                        params.append('utm_medium', medium);
                    }
                    
                    // Only add campaign if user selected one
                    if (campaign) {
                        params.append('utm_campaign', campaign);
                    }
                    
                    // Only add content if there is a name
                    if (name) {
                        params.append('utm_content', name);
                    }

                    const separator = baseUrl.includes('?') ? '&' : '?';
                    const fullUrl = baseUrl + separator + params.toString();

                    // Check for duplicate URL
                    const existingLink = links.find(l => l.fullUrl === fullUrl);
                    if (existingLink) {
                        duplicates.push({ name: name || source, url: fullUrl });
                        return; // Skip this link
                    }

                    let shortAlias = '';
                    const shortMap = {
                        'twitter': 'tw', 'discord': 'dc', 'youtube': 'yt', 'linkedin': 'li',
                        'reddit': 'rd', 'instagram': 'ig', 'facebook': 'fb', 'bilibili': 'bili',
                        'wechat': 'wx', 'wechat_group': 'wxg', 'weibo': 'wb', 
                        'xiaohongshu': 'xhs', 'zhihu': 'zh', 'douyin': 'dy', 'github': 'gh'
                    };
                    
                    const sourcePrefix = shortMap[source] || source.substring(0, 4).toLowerCase();
                    
                    if (name && shortPrefix) {
                        const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').substring(0, 30);
                        shortAlias = `${shortPrefix}-${cleanName}`;
                    } else if (name) {
                        const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').substring(0, 30);
                        shortAlias = `${sourcePrefix}-${cleanName}`;
                    } else if (shortPrefix) {
                        shortAlias = shortPrefix;
                    } else {
                        shortAlias = sourcePrefix + (baseUrl.includes('download') ? '-dl' : baseUrl.includes('cloud') ? '-cloud' : '');
                    }

                    // Check for duplicate short alias
                    if (shortAlias) {
                        const existingAlias = links.find(l => l.shortAlias === shortAlias);
                        if (existingAlias) {
                            shortAlias = shortAlias + '-' + Date.now().toString().slice(-4);
                        }
                    }

                    // Get default link mode from radio buttons
                    const defaultMode = document.querySelector('input[name="defaultLinkMode"]:checked').value;
                    
                    newLinks.push({
                        id: Date.now() + linkIndex++,
                        baseUrl: baseUrl,
                        fullUrl: fullUrl,
                        source: source,
                        medium: medium,
                        campaign: campaign,
                        content: name,
                        shortAlias: shortAlias,
                        note: name ? `${source} - ${name}` : `${source} - ${campaign || 'link'}`,
                        shortLink: '',
                        useCustomAlias: defaultMode === 'custom',
                        status: 'pending',
                        createdAt: new Date().toISOString()
                    });
                });
            });
        });

        if (duplicates.length > 0) {
            const dupList = duplicates.slice(0, 5).map(d => `• ${d.name}`).join('<br>');
            const more = duplicates.length > 5 ? `<br>... and ${duplicates.length - 5} more` : '';
            utils.showWarning(`Found ${duplicates.length} duplicate link(s):<br><br>${dupList}${more}<br><br>Duplicates were skipped.`, 'Duplicate Links Detected');
        }

        if (newLinks.length === 0) {
            utils.showWarning('No new links to add. All links already exist.', 'No New Links');
            return;
        }

        appState.addLinks(newLinks);
        
        // Update UI through table module
        if (window.table && window.table.updateTable) {
            window.table.updateTable();
        }
        if (window.table && window.table.updateStats) {
            window.table.updateStats();
        }
        
        const skipped = duplicates.length > 0 ? ` (${duplicates.length} skipped)` : '';
        utils.showSuccess(`${newLinks.length} link${newLinks.length > 1 ? 's' : ''} added!${skipped}`, 'Links Generated');
    }

    // Export to global scope
    window.form = {
        saveFormState,
        loadFormState,
        clearNamesField,
        updateBatchIndicator,
        handleSourceChange,
        handleMediumChange,
        updateSourceBatchIndicator,
        updateMediumBatchIndicator,
        getSourceValues,
        getMediumValues,
        getSourceValue,
        getMediumValue,
        updateShortAlias,
        generateLinks
    };
})();
