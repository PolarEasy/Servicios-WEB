// ============================================================
// SCRIPT COMPLETO - Luis Diosvan
// ============================================================

// ============================================================
// 1. ESPERAR A QUE LA INTRO TERMINE
// ============================================================
(function() {
    const overlay = document.getElementById('introOverlay');
    if (overlay) {
        document.body.style.animation = 'none';
        document.body.style.opacity = '0';
        
        document.addEventListener('introComplete', function() {
            document.body.style.animation = 'fadeIn 0.8s cubic-bezier(0.2, 0.9, 0.3, 1) forwards';
            document.body.style.opacity = '0';
        });
        
        setTimeout(() => {
            if (overlay && !overlay.classList.contains('hidden')) {
                overlay.classList.add('hidden');
                document.body.style.animation = 'fadeIn 0.8s cubic-bezier(0.2, 0.9, 0.3, 1) forwards';
                document.body.style.opacity = '0';
            }
        }, 6000);
    }
})();

// ============================================================
// 2. MENÚ HAMBURGUESA
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', function() {
            navLinks.classList.toggle('open');
        });

        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                navLinks.classList.remove('open');
            });
        });
    }

    // ============================================================
    // 3. AÑO EN FOOTER
    // ============================================================
    const footerYear = document.querySelector('footer .footer-copy p');
    if (footerYear) {
        const year = new Date().getFullYear();
        footerYear.textContent = '\u00a9 ' + year + ' Luis Diosvan · Hecho con ❤️ y código';
    }

    // ============================================================
    // 4. SCROLL SUAVE (solo en index)
    // ============================================================
    const path = window.location.pathname;
    if (path.includes('index.html') || path === '/' || path.endsWith('/') || path === '') {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
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
    // 5. PARTÍCULAS DE FONDO
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
            particle.style.boxShadow = '0 0 ' + (size * 2) + 'px ' + color + '40';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            container.appendChild(particle);
        }
    }
    createParticles();

    // ============================================================
    // 6. CONTADOR ANIMADO (solo en index)
    // ============================================================
    if (document.querySelector('[data-count]')) {
        const counters = document.querySelectorAll('[data-count]');
        counters.forEach(function(counter) {
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
            
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
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
    // 7. TEXTO DINÁMICO (solo en index)
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
        setInterval(function() {
            index = (index + 1) % phrases.length;
            dynamicText.style.opacity = '0';
            dynamicText.style.transform = 'translateY(-10px)';
            setTimeout(function() {
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
    // 8. SELECTOR DE TEMAS
    // ============================================================
    function initThemeSelector() {
        const buttons = document.querySelectorAll('.theme-btn');
        const html = document.documentElement;
        const savedTheme = localStorage.getItem('theme') || 'dark';
        html.setAttribute('data-theme', savedTheme);
        updateActiveButton(savedTheme);
        
        buttons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const theme = btn.getAttribute('data-theme');
                html.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
                updateActiveButton(theme);
                document.body.style.transition = 'background 0.5s ease, color 0.4s ease';
            });
        });
        
        function updateActiveButton(theme) {
            buttons.forEach(function(b) {
                if (b.getAttribute('data-theme') === theme) {
                    b.classList.add('active');
                } else {
                    b.classList.remove('active');
                }
            });
        }
    }
    initThemeSelector();

    // ============================================================
    // 9. CURSOR NEÓN (solo en desktop)
    // ============================================================
    if (window.innerWidth > 768) {
        const glow = document.createElement('div');
        glow.style.cssText = 'position:fixed;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(124,107,255,0.04) 0%,transparent 70%);pointer-events:none;z-index:0;transform:translate(-50%,-50%);will-change:transform;';
        document.body.appendChild(glow);
        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;
        document.addEventListener('mousemove', function(e) {
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
    // 10. REVELADO DE TARJETAS AL HACER SCROLL
    // ============================================================
    const cards = document.querySelectorAll('.service-card, .tool-card, .testimonial-card, .file-item');
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry, index) {
            if (entry.isIntersecting) {
                setTimeout(function() {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    
    cards.forEach(function(card, i) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px)';
        card.style.transition = 'opacity 0.6s ease ' + (i * 0.06) + 's, transform 0.6s ease ' + (i * 0.06) + 's';
        observer.observe(card);
    });

    // ============================================================
    // 11. EFECTO PARALLAX EN HERO (solo index)
    // ============================================================
    const hero = document.querySelector('.hero');
    if (hero && (path.includes('index.html') || path === '/' || path.endsWith('/') || path === '')) {
        document.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            hero.style.transform = 'translateY(' + rate + 'px)';
            hero.style.opacity = 1 - (scrolled / 800);
        }, { passive: true });
    }

    // ============================================================
    // 12. EFECTO DE PARPADEO EN BADGES
    // ============================================================
    const badges = document.querySelectorAll('.floating-badge');
    badges.forEach(function(badge, i) {
        badge.style.animation = 'floatBadge 3s ease-in-out ' + (i * 1) + 's infinite';
    });

    console.log('\u2705 Luis Diosvan · Página cargada con todos los efectos');

}); // Fin del DOMContentLoaded
