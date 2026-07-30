// ============================================================
// ============ MENÚ HAMBURGUESA ============
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
    // ============ AÑO EN FOOTER ============
    // ============================================================
    const footerYear = document.querySelector('footer .footer-copy p');
    if (footerYear) {
        const year = new Date().getFullYear();
        footerYear.textContent = `© ${year} Luis Diosvan · Hecho con ❤️ y código`;
    }

    // ============================================================
    // ============ SCROLL SUAVE ============
    // ============================================================
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

    // ============================================================
    // ============ PARTÍCULAS DE FONDO ============
    // ============================================================
    function createParticles() {
        const container = document.getElementById('particles-container');
        if (!container) return;
        
        const colors = ['#7c6bff', '#a78bfa', '#6a59e8', '#8b7bfa'];
        const count = 60;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 2;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.background = color;
            particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            
            container.appendChild(particle);
        }
    }
    createParticles();

    // ============================================================
    // ============ CONTADOR ANIMADO ============
    // ============================================================
    function animateCounters() {
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
            
            // Iniciar cuando el elemento sea visible
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
    animateCounters();

    // ============================================================
    // ============ TEXTO DINÁMICO (Rotación) ============
    // ============================================================
    function rotateText() {
        const element = document.getElementById('dynamic-text');
        if (!element) return;
        
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
            element.style.opacity = '0';
            element.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                element.textContent = phrases[index];
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 300);
        }, 4000);
        
        // Estado inicial
        element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }
    rotateText();

    // ============================================================
    // ============ SELECTOR DE TEMAS ============
    // ============================================================
    function initThemeSelector() {
        const buttons = document.querySelectorAll('.theme-btn');
        const html = document.documentElement;
        
        // Cargar tema guardado
        const savedTheme = localStorage.getItem('theme') || 'dark';
        html.setAttribute('data-theme', savedTheme);
        updateActiveButton(savedTheme);
        
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.getAttribute('data-theme');
                html.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
                updateActiveButton(theme);
                
                // Efecto de transición suave
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
    // ============ CURSOR CON BRILLO (efecto neón) ============
    // ============================================================
    function initGlowCursor() {
        const glow = document.createElement('div');
        glow.style.cssText = `
            position: fixed;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(124,107,255,0.06) 0%, transparent 70%);
            pointer-events: none;
            z-index: 0;
            transition: opacity 0.3s ease;
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
            currentX += (mouseX - currentX) * 0.05;
            currentY += (mouseY - currentY) * 0.05;
            
            glow.style.left = currentX + 'px';
            glow.style.top = currentY + 'px';
            
            requestAnimationFrame(animateGlow);
        }
        animateGlow();
    }
    initGlowCursor();

    // ============================================================
    // ============ EFECTO PARALLAX EN HERO ============
    // ============================================================
    function initParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        document.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            hero.style.transform = `translateY(${rate}px)`;
            hero.style.opacity = 1 - (scrolled / 800);
        }, { passive: true });
    }
    initParallax();

    // ============================================================
    // ============ REVELADO DE TARJETAS AL HACER SCROLL ============
    // ============================================================
    function initScrollReveal() {
        const cards = document.querySelectorAll('.service-card, .tool-card, .testimonial-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = index * 100;
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        cards.forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
            observer.observe(card);
        });
    }
    initScrollReveal();

    // ============================================================
    // ============ EFECTO DE PARPADEO EN BADGES ============
    // ============================================================
    function initBadgePulse() {
        const badges = document.querySelectorAll('.floating-badge');
        badges.forEach((badge, i) => {
            badge.style.animation = `floatBadge 3s ease-in-out ${i * 1}s infinite`;
        });
    }
    initBadgePulse();

    console.log('🚀 Luis Diosvan · Página cargada con todos los efectos');
});
