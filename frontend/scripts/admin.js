const token = localStorage.getItem('adminToken');
if (token) {
    checkAuth(token);
}

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('adminToken', data.token);
            showAdminPanel(data.results);
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('فشل الاتصال بالخادم');
    }
});

async function checkAuth(token) {
    try {
        const response = await fetch('/api/admin/verify', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const data = await response.json();
            showAdminPanel(data.results);
        } else {
            localStorage.removeItem('adminToken');
        }
    } catch (error) {
        console.error('Auth check failed');
    }
}

function showAdminPanel(results) {
    document.getElementById('login-section').classList.add('d-none');
    document.getElementById('admin-panel').classList.remove('d-none');
    
    document.getElementById('admin-yes').textContent = results.yes;
    document.getElementById('admin-no').textContent = results.no;
    document.getElementById('admin-total').textContent = results.total;
}

function logout() {
    localStorage.removeItem('adminToken');
    location.reload();
}

async function exportCSV() {
    const token = localStorage.getItem('adminToken');
    try {
        const response = await fetch('/api/admin/export', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'votes.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } else {
            alert('فشل تصدير الملف');
        }
    } catch (error) {
        alert('خطأ في الاتصال');
    }
}

function showError(message) {
    const errorDiv = document.getElementById('login-error');
    errorDiv.textContent = message;
    errorDiv.classList.remove('d-none');
}