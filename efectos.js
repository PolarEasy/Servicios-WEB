// ================================================================
// EFECTOS ÚNICOS - Luis Diosvan (VERSIÓN ESTABLE)
// ================================================================

document.addEventListener('DOMContentLoaded', function() {

    // ============================================================
    // 1. CURSOR CON EXPLOSIÓN DE PARTÍCULAS AL HACER CLIC
    // ============================================================
    document.addEventListener('click', function(e) {
        const colors = ['#7c6bff', '#a78bfa', '#6a59e8', '#ff6bcd', '#00d4ff', '#f5a623', '#fff'];
        const count = 18;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            const size = 3 + Math.random() * 7;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 6;
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
                life -= 0.018;
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
        const threshold = 400;

        if (scrollY > threshold && !tornadoActive) {
            tornadoActive = true;
            const container = document.getElementById('particles-container');
            if (container) {
                container.classList.add('particle-tornado');
            }

            clearTimeout(tornadoTimeout);
            tornadoTimeout = setTimeout(function() {
                const container = document.getElementById('particles-container');
                if (container) {
                    container.classList.remove('particle-tornado');
                }
                tornadoActive = false;
            }, 2500);
        }
    });

    // ============================================================
    // 3. MOUSE GLOW MEJORADO
    // ============================================================
    if (window.innerWidth > 768) {
        const mouseGlow = document.createElement('div');
        mouseGlow.style.cssText = `
                    position: fixed;
                    width: 300px;
                    height: 300px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(124,107,255,0.05) 0%, transparent 70%);
                    pointer-events: none;
                    z-index: 0;
                    transform: translate(-50%, -50%);
                    transition: width 0.4s ease, height 0.4s ease;
                `;
        document.body.appendChild(mouseGlow);

        let mouseX = 0,
            mouseY = 0;
        let currentX = 0,
            currentY = 0;

        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateMouseGlow() {
            currentX += (mouseX - currentX) * 0.06;
            currentY += (mouseY - currentY) * 0.06;
            mouseGlow.style.left = currentX + 'px';
            mouseGlow.style.top = currentY + 'px';
            requestAnimationFrame(animateMouseGlow);
        }
        animateMouseGlow();
    }

    // ============================================================
    // 4. EFECTO DE BRILLO EN TARJETAS CON EL MOUSE
    // ============================================================
    document.querySelectorAll('.service-card, .tool-card, .testimonial-card').forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            let glow = card.querySelector('.mouse-glow');
            if (!glow) {
                glow = document.createElement('div');
                glow.className = 'mouse-glow';
                glow.style.cssText = `
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            pointer-events: none;
                            border-radius: inherit;
                            background: radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(124,107,255,0.06) 0%, transparent 60%);
                            opacity: 0;
                            transition: opacity 0.3s ease;
                        `;
                card.style.position = 'relative';
                card.style.overflow = 'hidden';
                card.appendChild(glow);
            }

            glow.style.setProperty('--mouse-x', x * 100 + '%');
            glow.style.setProperty('--mouse-y', y * 100 + '%');
            glow.style.background =
                `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(124,107,255,0.06) 0%, transparent 60%)`;
            glow.style.opacity = '1';
        });

        card.addEventListener('mouseleave', function() {
            const glow = card.querySelector('.mouse-glow');
            if (glow) {
                glow.style.opacity = '0';
            }
        });
    });

    // ============================================================
    // 5. EFECTO DE "PARPADEO" EN ESTADÍSTICAS (NUEVO)
    // ============================================================
    document.querySelectorAll('.stat-number').forEach(function(stat) {
        stat.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.2s ease';
        });
        stat.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // ============================================================
    // 6. EFECTO "CINTA MAGNÉTICA" EN SUBTÍTULOS (solo CSS)
    // ============================================================
    // Ya está en el CSS, no necesita JS

    console.log('✨ Efectos únicos activados (versión estable)');
});
