// ========== Utility Functions ==========

// SweetAlert2 Helper Functions
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

function showSuccess(message, title = 'Success!') {
    Toast.fire({
        icon: 'success',
        title: title,
        text: message
    });
}

function showError(message, title = 'Error') {
    Swal.fire({
        icon: 'error',
        title: title,
        text: message,
        confirmButtonColor: '#667eea'
    });
}

function showWarning(message, title = 'Warning') {
    Swal.fire({
        icon: 'warning',
        title: title,
        html: message,
        confirmButtonColor: '#667eea'
    });
}

function showInfo(message, title = 'Info') {
    Swal.fire({
        icon: 'info',
        title: title,
        html: message,
        confirmButtonColor: '#667eea'
    });
}

async function showConfirm(message, title = 'Confirm') {
    const result = await Swal.fire({
        title: title,
        html: message,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#667eea',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
    });
    return result.isConfirmed;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

function downloadJSON(content, filename) {
    const blob = new Blob([content], { type: 'application/json;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result.map(v => v.replace(/^"|"$/g, '').trim());
}

// Export utilities to global scope
window.utils = {
    Toast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    escapeHtml,
    sleep,
    downloadCSV,
    downloadJSON,
    parseCSVLine
};

