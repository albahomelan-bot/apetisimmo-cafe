/* ==========================================================================
   Apetisimmo Cafe Custom JavaScript functionality
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* 1. Header scroll state */
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* 2. Mobile Nav drawer */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            });
        });
    }

    /* 3. Navigation active state on Scroll */
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 220)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    /* 4. Intersection Observer for Scroll reveal */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    if ('IntersectionObserver' in window) {
        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        };

        const revealObserver = new IntersectionObserver(revealCallback, {
            root: null,
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    } else {
        revealElements.forEach(el => el.classList.add('revealed'));
    }

    /* 5. Language Switcher Logic (Trilingual UA / EN / SQ) */
    const langSwitcherBtn = document.getElementById('lang-switcher-btn');
    
    if (langSwitcherBtn) {
        const updateMeta = (lang) => {
            const titles = {
                uk: "Apetisimmo | Домашня українська кухня в Дурресі, Албанія",
                en: "Apetisimmo | Authentic Ukrainian Cuisine in Durrës, Albania",
                sq: "Apetisimmo | Kuzhinë Ukrainase Shtëpiake në Durrës, Shqipëri"
            };
            const descriptions = {
                uk: "Кафе Apetisimmo в Дурресі. Справжня домашня українська кухня: борщ, вареники, голубці, медовик. Затишна сімейна атмосфера на Rruga Pavarësia.",
                en: "Apetisimmo Cafe in Durrës. Authentic homemade Ukrainian cuisine: borscht, varenyki, holubtsi, honey cake. Cozy family atmosphere on Rruga Pavarësia.",
                sq: "Apetisimmo Kafe në Durrës. Kuzhinë autentike shtëpiake ukrainase: borsh, varenyki, holubtsi, tortë me mjaltë. Atmosferë komode familjare në Rruga Pavarësia."
            };
            
            document.title = titles[lang] || titles.uk;
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute('content', descriptions[lang] || descriptions.uk);
            }
        };

        // Load initial language if saved, otherwise default is 'uk'
        const savedLang = localStorage.getItem('lang') || 'uk';
        document.body.className = `lang-${savedLang}`;
        updateMeta(savedLang);
        
        langSwitcherBtn.addEventListener('click', () => {
            const body = document.body;
            let currentLang = 'uk';
            if (body.classList.contains('lang-uk')) currentLang = 'uk';
            else if (body.classList.contains('lang-en')) currentLang = 'en';
            else if (body.classList.contains('lang-sq')) currentLang = 'sq';
            
            let nextLang = 'uk';
            if (currentLang === 'uk') nextLang = 'en';
            else if (currentLang === 'en') nextLang = 'sq';
            else if (currentLang === 'sq') nextLang = 'uk';
            
            body.className = `lang-${nextLang}`;
            localStorage.setItem('lang', nextLang);
            updateMeta(nextLang);
        });
    }

    /* 6. AJAX booking Form Netlify handler */
    const bookingForm = document.getElementById('cafe-booking-form');
    const successPopup = document.getElementById('form-success-popup');
    const successName = document.getElementById('success-name');
    const successPhone = document.getElementById('success-phone');
    const successCloseBtn = document.getElementById('success-close-btn');

    if (bookingForm && successPopup) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name').value;
            const phone = document.getElementById('form-phone').value;
            
            const formData = new FormData(bookingForm);

            // POST to netlify endpoint via AJAX
            fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString()
            })
            .then(() => {
                if (successName) successName.textContent = name;
                if (successPhone) successPhone.textContent = phone;
                successPopup.classList.add('show');
            })
            .catch(error => {
                console.warn('Form post failed (offline fallback):', error);
                // Visual fallback
                if (successName) successName.textContent = name;
                if (successPhone) successPhone.textContent = phone;
                successPopup.classList.add('show');
            });
        });

        if (successCloseBtn) {
            successCloseBtn.addEventListener('click', () => {
                successPopup.classList.remove('show');
                bookingForm.reset();
            });
        }
    }
});
