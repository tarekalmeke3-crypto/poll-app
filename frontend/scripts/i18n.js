// متغير اللغة الحالية
var currentLanguage = localStorage.getItem('lang') || 'ar';

// قائمة المبادئ بالعربية
const principlesAr = [
    "اللامركزية السياسية الموسعة / الفدرالية",
    "حرية المعتقلين",
    "إنشاء صندوق لدعم الإقليم",
    "حقوق الموظفين",
    "العدالة الاجتماعية"
];

// قائمة المبادئ بالإنجليزية
const principlesEn = [
    "Expanded political decentralization / federalism",
    "Freedom of detainees",
    "Establishment of a fund to support the region",
    "Employee rights",
    "Social justice"
];

// النصوص المترجمة
const translations = {
    ar: {
        title: "استفتاء إقليم وسط وغرب سورية",
        question: "هل توافق على تفويض الهيئة السياسية لإقليم وسط وغرب سورية ممثلة بالدكتور حسن مرهج بتمثيلك والدفاع عن حقوقك داخل سورية وخارجها وفق مبادئها المعلنة:",
        principles: principlesAr,
        yes: "نعم",
        no: "لا",
        results: "النتائج المباشرة",
        total: "إجمالي الأصوات"
    },
    en: {
        title: "Referendum on the Central and Western Syria Region",
        question: "Do you agree to authorize the political body of the Central and Western Syria Region, represented by Dr. Hassan Marhaj, to represent you and defend your rights inside and outside Syria according to its declared principles:",
        principles: principlesEn,
        yes: "Yes",
        no: "No",
        results: "Live Results",
        total: "Total Votes"
    }
};

// دالة تطبيق اللغة
function setLanguage(lang) {
    const t = translations[lang];
    if (!t) return;

    // تحديث العنوان
    const titleEl = document.querySelector('[data-i18n="title"]');
    if (titleEl) titleEl.textContent = t.title;

    // تحديث السؤال
    const questionEl = document.querySelector('[data-i18n="question"]');
    if (questionEl) questionEl.textContent = t.question;

    // تحديث أزرار نعم/لا
    const yesBtn = document.querySelector('[data-i18n="yes"]');
    const noBtn = document.querySelector('[data-i18n="no"]');
    if (yesBtn) yesBtn.textContent = t.yes;
    if (noBtn) noBtn.textContent = t.no;

    // تحديث عنوان النتائج
    const resultsEl = document.querySelector('[data-i18n="results"]');
    if (resultsEl) resultsEl.textContent = t.results;

    // تحديث نص "إجمالي الأصوات"
    const totalTextEl = document.getElementById('total-text');
    if (totalTextEl) {
        totalTextEl.innerHTML = t.total + ': <span id="total">0</span>';
    }

    // تحديث قائمة المبادئ
    const principlesList = document.getElementById('principles-list');
    if (principlesList) {
        principlesList.innerHTML = '';
        t.principles.forEach(principle => {
            const li = document.createElement('li');
            li.textContent = principle;
            principlesList.appendChild(li);
        });
    }

    // تحديث اتجاه الصفحة
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // تحديث نص زر اللغة
    const langText = document.getElementById('lang-text');
    if (langText) {
        langText.textContent = lang === 'ar' ? 'English' : 'العربية';
    }

    // حفظ اللغة
    localStorage.setItem('lang', lang);
    currentLanguage = lang;
    
    console.log('✅ تم تغيير اللغة إلى:', lang);
}

// دالة تبديل اللغة (عامة)
window.toggleLanguage = function() {
    const newLang = currentLanguage === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
};

// تشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ i18n.js loaded');
    setLanguage(currentLanguage);
});