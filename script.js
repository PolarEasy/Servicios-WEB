// ============================================================
// ESPERAR A QUE LA INTRO TERMINE
// ============================================================
(function() {
    // Si existe la intro, ocultamos el body hasta que termine
    const overlay = document.getElementById('introOverlay');
    if (overlay) {
        // El body ya tiene fadeIn, pero lo pausamos
        document.body.style.animation = 'none';
        document.body.style.opacity = '0';
        
        document.addEventListener('introComplete', function() {
            // Restaurar animación
            document.body.style.animation = 'fadeIn 0.8s ease-out forwards';
            document.body.style.opacity = '0';
        });
        
        // Fallback: si la intro no se dispara en 6 segundos, mostramos
        setTimeout(() => {
            if (overlay && !overlay.classList.contains('hidden')) {
                overlay.classList.add('hidden');
                document.body.style.animation = 'fadeIn 0.8s ease-out forwards';
                document.body.style.opacity = '0';
            }
        }, 6000);
    }
})();
// ============================================================
// MENÚ HAMBURGUESA
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }

    // ============================================================
    // AÑO EN FOOTER
    // ============================================================
    const footerYear = document.querySelector('footer .footer-copy p');
    if (footerYear) {
        const year = new Date().getFullYear();
        footerYear.textContent = `© ${year} Luis Diosvan · Hecho con ❤️ y código`;
    }

    // ============================================================
    // SCROLL SUAVE (solo en index)
    // ============================================================
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // ============================================================
    // PARTÍCULAS
    // ============================================================
    function createParticles() {
        const container = document.getElementById('particles-container');
        if (!container) return;
        
        const colors = ['#7c6bff', '#a78bfa', '#6a59e8', '#8b7bfa'];
        const count = 50;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 3 + 2;
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.background = color;
            particle.style.boxShadow = `0 0 ${size * 2}px ${color}40`;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            container.appendChild(particle);
        }
    }
    createParticles();

    // ============================================================
    // CONTADOR ANIMADO (solo en index)
    // ============================================================
    if (document.querySelector('[data-count]')) {
        const counters = document.querySelectorAll('[data-count]');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const startTime = performance.now();
            
            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const current = Math.round(progress * target);
                counter.textContent = current;
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        requestAnimationFrame(updateCounter);
                        observer.disconnect();
                    }
                });
            });
            observer.observe(counter);
        });
    }

    // ============================================================
    // TEXTO DINÁMICO (solo en index)
    // ============================================================
    const dynamicText = document.getElementById('dynamic-text');
    if (dynamicText) {
        const phrases = [
            'herramientas que funcionan',
            'soluciones a tu medida',
            'automatización inteligente',
            'software que impulsa negocios',
            'código que resuelve problemas'
        ];
        let index = 0;
        setInterval(() => {
            index = (index + 1) % phrases.length;
            dynamicText.style.opacity = '0';
            dynamicText.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                dynamicText.textContent = phrases[index];
                dynamicText.style.opacity = '1';
                dynamicText.style.transform = 'translateY(0)';
            }, 300);
        }, 4000);
        dynamicText.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        dynamicText.style.opacity = '1';
        dynamicText.style.transform = 'translateY(0)';
    }

    // ============================================================
    // SELECTOR DE TEMAS
    // ============================================================
    function initThemeSelector() {
        const buttons = document.querySelectorAll('.theme-btn');
        const html = document.documentElement;
        const savedTheme = localStorage.getItem('theme') || 'dark';
        html.setAttribute('data-theme', savedTheme);
        updateActiveButton(savedTheme);
        
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.getAttribute('data-theme');
                html.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
                updateActiveButton(theme);
                document.body.style.transition = 'background 0.5s ease, color 0.4s ease';
            });
        });
        
        function updateActiveButton(theme) {
            buttons.forEach(b => {
                b.classList.toggle('active', b.getAttribute('data-theme') === theme);
            });
        }
    }
    initThemeSelector();

    // ============================================================
    // CURSOR NEÓN (solo en desktop)
    // ============================================================
    if (window.innerWidth > 768) {
        const glow = document.createElement('div');
        glow.style.cssText = `
            position: fixed;
            width: 400px;
            height: 400px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(124,107,255,0.04) 0%, transparent 70%);
            pointer-events: none;
            z-index: 0;
            transform: translate(-50%, -50%);
            will-change: transform;
        `;
        document.body.appendChild(glow);
        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        function animateGlow() {
            currentX += (mouseX - currentX) * 0.04;
            currentY += (mouseY - currentY) * 0.04;
            glow.style.left = currentX + 'px';
            glow.style.top = currentY + 'px';
            requestAnimationFrame(animateGlow);
        }
        animateGlow();
    }

    // ============================================================
    // REVELADO DE TARJETAS
    // ============================================================
    const cards = document.querySelectorAll('.service-card, .tool-card, .testimonial-card, .file-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    
    cards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px)';
        card.style.transition = `opacity 0.6s ease ${i * 0.06}s, transform 0.6s ease ${i * 0.06}s`;
        observer.observe(card);
    });

    console.log('🚀 Página cargada con todos los efectos');
});
