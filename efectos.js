// ================================================================
// EFECTOS ÚNICOS - Luis Diosvan
// ================================================================

document.addEventListener('DOMContentLoaded', function() {

    // ============================================================
    // 1. CURSOR CON EXPLOSIÓN DE PARTÍCULAS AL HACER CLIC
    // ============================================================
    document.addEventListener('click', function(e) {
        const colors = ['#7c6bff', '#a78bfa', '#6a59e8', '#ff6bcd', '#00d4ff', '#f5a623', '#fff'];
        const count = 15;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            const size = 4 + Math.random() * 8;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 5;
            const x = e.clientX + (Math.random() - 0.5) * 10;
            const y = e.clientY + (Math.random() - 0.5) * 10;
            
            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${x}px;
                top: ${y}px;
                box-shadow: 0 0 ${size * 2}px ${color};
                transition: none;
            `;
            
            document.body.appendChild(particle);
            
            const dx = Math.cos(angle) * speed;
            const dy = Math.sin(angle) * speed - 2;
            let life = 1;
            
            function animateParticle() {
                const rect = particle.getBoundingClientRect();
                particle.style.left = (rect.left + dx) + 'px';
                particle.style.top = (rect.top + dy + 0.5) + 'px';
                life -= 0.02;
                particle.style.opacity = life;
                particle.style.transform = `scale(${life * 1.2}) rotate(${life * 360}deg)`;
                
                if (life > 0) {
                    requestAnimationFrame(animateParticle);
                } else {
                    particle.remove();
                }
            }
            
            animateParticle();
        }
    });

    // ============================================================
    // 2. EFECTO TORNADO EN PARTÍCULAS AL HACER SCROLL
    // ============================================================
    let tornadoActive = false;
    let tornadoTimeout = null;

    document.addEventListener('scroll', function() {
        const scrollY = window.pageYOffset;
        const threshold = 300;
        
        if (scrollY > threshold && !tornadoActive) {
            tornadoActive = true;
            document.getElementById('particles-container').classList.add('particle-tornado');
            
            clearTimeout(tornadoTimeout);
            tornadoTimeout = setTimeout(function() {
                document.getElementById('particles-container').classList.remove('particle-tornado');
                tornadoActive = false;
            }, 2000);
        }
    });

    // ============================================================
    // 3. EFECTO DE "RATÓN SIGUE EL CURSOR" (mejorado)
    // ============================================================
    const mouseGlow = document.createElement('div');
    mouseGlow.style.cssText = `
        position: fixed;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(124,107,255,0.06) 0%, transparent 70%);
        pointer-events: none;
        z-index: 0;
        transform: translate(-50%, -50%);
        transition: width 0.3s ease, height 0.3s ease;
    `;
    document.body.appendChild(mouseGlow);
    
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateMouseGlow() {
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;
        mouseGlow.style.left = currentX + 'px';
        mouseGlow.style.top = currentY + 'px';
        requestAnimationFrame(animateMouseGlow);
    }
    animateMouseGlow();

    // ============================================================
    // 4. EFECTO DE "BRILLO" EN TARJETAS CON EL MOUSE
    // ============================================================
    document.querySelectorAll('.service-card, .tool-card, .testimonial-card').forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const angle = Math.atan2(y - 0.5, x - 0.5) * 180 / Math.PI;
            card.style.setProperty('--mouse-x', x * 100 + '%');
            card.style.setProperty('--mouse-y', y * 100 + '%');
            card.style.setProperty('--mouse-angle', angle + 'deg');
            
            // Efecto de luz que sigue al mouse
            const glow = card.querySelector('.mouse-glow') || document.createElement('div');
            if (!card.querySelector('.mouse-glow')) {
                glow.className = 'mouse-glow';
                glow.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    border-radius: inherit;
                    background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(124,107,255,0.06) 0%, transparent 60%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                `;
                card.style.position = 'relative';
                card.style.overflow = 'hidden';
                card.appendChild(glow);
            }
            
            const glowEl = card.querySelector('.mouse-glow');
            if (glowEl) {
                glowEl.style.setProperty('--mouse-x', x * 100 + '%');
                glowEl.style.setProperty('--mouse-y', y * 100 + '%');
                glowEl.style.opacity = '1';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const glow = card.querySelector('.mouse-glow');
            if (glow) {
                glow.style.opacity = '0';
            }
        });
    });

    // ============================================================
    // 5. EFECTO DE "TEXTO QUE ESCRIBE SOLO"
    // ============================================================
    const heroSub = document.querySelector('.hero-sub');
    if (heroSub) {
        const originalText = heroSub.innerHTML;
        heroSub.innerHTML = '';
        
        // Solo aplicar si no estamos en móvil
        if (window.innerWidth > 768) {
            let index = 0;
            const chars = originalText.split('');
            
            function typeLetter() {
                if (index < chars.length) {
                    const char = chars[index];
                    if (char === '<') {
                        // Si es una etiqueta HTML, la agregamos completa
                        let tag = '';
                        while (chars[index] !== '>') {
                            tag += chars[index];
                            index++;
                        }
                        tag += chars[index];
                        heroSub.innerHTML += tag;
                        index++;
                    } else {
                        heroSub.innerHTML += char;
                        index++;
                    }
                    setTimeout(typeLetter, 5 + Math.random() * 10);
                }
            }
            
            // Iniciar el efecto solo si el elemento es visible
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        setTimeout(typeLetter, 500);
                        observer.disconnect();
                    }
                });
            });
            observer.observe(heroSub);
        } else {
            heroSub.innerHTML = originalText;
        }
    }

    // ============================================================
    // 6. EFECTO DE "PARTÍCULAS QUE SIGUEN EL MOUSE"
    // ============================================================
    if (window.innerWidth > 768) {
        const particleTrail = [];
        const trailCount = 8;
        
        for (let i = 0; i < trailCount; i++) {
            const p = document.createElement('div');
            p.style.cssText = `
                position: fixed;
                width: 3px;
                height: 3px;
                background: rgba(124,107,255,0.3);
                border-radius: 50%;
                pointer-events: none;
                z-index: 0;
                transition: none;
                opacity: 0;
            `;
            document.body.appendChild(p);
            particleTrail.push({
                el: p,
                x: 0,
                y: 0,
                delay: i * 0.05
            });
        }
        
        let mouseX2 = 0, mouseY2 = 0;
        document.addEventListener('mousemove', function(e) {
            mouseX2 = e.clientX;
            mouseY2 = e.clientY;
        });
        
        function animateTrail() {
            particleTrail.forEach(function(p, i) {
                const targetX = mouseX2;
                const targetY = mouseY2;
                const speed = 0.1 + (i / trailCount) * 0.05;
                p.x += (targetX - p.x) * speed;
                p.y += (targetY - p.y) * speed;
                p.el.style.left = p.x + 'px';
                p.el.style.top = p.y + 'px';
                p.el.style.opacity = 0.5 - (i / trailCount) * 0.4;
                p.el.style.width = (3 - (i / trailCount) * 1.5) + 'px';
                p.el.style.height = (3 - (i / trailCount) * 1.5) + 'px';
            });
            requestAnimationFrame(animateTrail);
        }
        animateTrail();
    }

    console.log('✨ Efectos únicos activados');
});
