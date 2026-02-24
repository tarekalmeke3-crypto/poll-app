// تعريف socket
socket = io();

// استقبال تحديثات النتائج
socket.on('results-update', (data) => {
    updateUI(data);
});

// جلب النتائج الأولية
async function fetchResults() {
    try {
        const response = await fetch('/api/results');
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        console.error('Error fetching results:', error);
    }
}

// تحديث واجهة المستخدم
function updateUI(data) {
    document.getElementById('yes-count').textContent = data.yes;
    document.getElementById('no-count').textContent = data.no;
    document.getElementById('total').textContent = data.total;

    if (data.total > 0) {
        document.getElementById('yes-percent').textContent = ((data.yes / data.total) * 100).toFixed(1) + '%';
        document.getElementById('no-percent').textContent = ((data.no / data.total) * 100).toFixed(1) + '%';
    } else {
        document.getElementById('yes-percent').textContent = '0%';
        document.getElementById('no-percent').textContent = '0%';
    }
}

// دالة التصويت بدون reCAPTCHA
async function vote(choice) {
    try {
        let userId = localStorage.getItem('pollUserId');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('pollUserId', userId);
        }

        const response = await fetch('/api/vote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                vote: choice,
                userId: userId
            })
        });

        const result = await response.json();
        if (response.ok) {
            alert('تم تسجيل صوتك بنجاح!');
        } else {
            alert(result.message || 'حدث خطأ أثناء التصويت');
        }
    } catch (error) {
        console.error('Vote error:', error);
        alert('فشل الاتصال بالخادم');
    }
}

// تحميل النتائج عند فتح الصفحة
window.onload = fetchResults;