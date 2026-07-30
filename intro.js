// ============================================================
// INTRO PIXAR - Cubitos que forman "LDV"
// ============================================================

(function() {
    'use strict';

    // ============================================================
    // CONFIGURACIÓN
    // ============================================================
    const CONFIG = {
        particleCount: 600,          // Cubitos totales
        letterSpacing: 0.9,          // Separación entre letras
        animationDuration: 2800,     // ms para ensamblaje
        cubeSize: 3.5,               // Tamaño de cada cubito
        colorStart: '#7c6bff',
        colorEnd: '#a78bfa',
        bgColor: '#0a0a0f',
        gravity: 0.03,
        damping: 0.98,
    };

    // ============================================================
    // DOM REFS
    // ============================================================
    const overlay = document.getElementById('introOverlay');
    const canvas = document.getElementById('introCanvas');
    const ctx = canvas.getContext('2d');
    const progressBar = document.querySelector('.intro-progress-bar');
    const flash = document.querySelector('.intro-flash');

    // ============================================================
    // DIMENSIONES
    // ============================================================
    let W, H;

    function resizeCanvas() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // ============================================================
    // DIBUJAR TEXTO "LDV" EN UN CANVAS OCULTO PARA OBTENER PÍXELES
    // ============================================================
    function getTextPixels(text, fontSize) {
        const offscreen = document.createElement('canvas');
        const offCtx = offscreen.getContext('2d');
        
        // Tamaño del canvas offscreen
        offscreen.width = W * 0.85;
        offscreen.height = H * 0.55;
        
        offCtx.fillStyle = '#000';
        offCtx.fillRect(0, 0, offscreen.width, offscreen.height);
        
        // Configurar fuente
        const font = `bold ${fontSize}px 'Inter', 'Arial', sans-serif`;
        offCtx.font = font;
        offCtx.textAlign = 'center';
        offCtx.textBaseline = 'middle';
        offCtx.fillStyle = '#fff';
        offCtx.fillText(text, offscreen.width / 2, offscreen.height / 2);
        
        // Obtener datos de píxeles
        const imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
        const data = imageData.data;
        
        // Extraer posiciones donde hay píxeles blancos
        const positions = [];
        const step = 2; // Muestreo para reducir cantidad de puntos
        
        for (let y = 0; y < offscreen.height; y += step) {
            for (let x = 0; x < offscreen.width; x += step) {
                const index = (y * offscreen.width + x) * 4;
                // Si el píxel es blanco (valor > 128)
                if (data[index] > 128) {
                    // Mapear a coordenadas del canvas principal
                    const px = (x / offscreen.width) * W;
                    const py = (y / offscreen.height) * H;
                    positions.push({ x: px, y: py });
                }
            }
        }
        
        return positions;
    }

    // ============================================================
    // PARTÍCULAS
    // ============================================================
    let particles = [];
    let targetPositions = [];
    let progress = 0;
    let isComplete = false;
    let animationFrame = null;

    class Particle {
        constructor(targetX, targetY) {
            this.targetX = targetX;
            this.targetY = targetY;
            
            // Posición inicial: desde los bordes
            const side = Math.random() < 0.5 ? 'left' : 'right';
            if (side === 'left') {
                this.x = -Math.random() * W * 0.4;
                this.y = Math.random() * H;
            } else {
                this.x = W + Math.random() * W * 0.4;
                this.y = Math.random() * H;
            }
            
            // Velocidad aleatoria
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 0.5;
            this.vx = Math.cos(angle) * speed * 1.2;
            this.vy = Math.sin(angle) * speed * 1.2;
            
            // Tamaño y color
            this.size = CONFIG.cubeSize * (0.6 + Math.random() * 0.8);
            const hue = 250 + Math.random() * 30;
            this.color = `hsl(${hue}, 70%, ${65 + Math.random() * 25}%)`;
            
            // Fase de animación
            this.phase = Math.random() * Math.PI * 2;
            this.delay = Math.random() * 200;
            this.dist = 0;
            
            // Estado
            this.active = true;
        }

        update(time, progress) {
            const p = Math.min(progress, 1);
            
            // Interpolación suave con easing
            const ease = p < 0.5 
                ? 2 * p * p 
                : 1 - Math.pow(-2 * p + 2, 2) / 2;
            
            // Movimiento hacia el target con efecto flotante
            const targetX = this.targetX;
            const targetY = this.targetY;
            
            // Si la partícula ya llegó, se queda quieta con pequeña vibración
            if (p >= 1) {
                const vib = 0.4;
                this.x = targetX + Math.sin(time * 0.002 + this.phase) * vib;
                this.y = targetY + Math.cos(time * 0.0025 + this.phase * 0.7) * vib;
                this.dist = 0;
                return;
            }
            
            // Efecto de atracción con física suave
            const dx = targetX - this.x;
            const dy = targetY - this.y;
            this.dist = Math.sqrt(dx * dx + dy * dy);
            
            // Fuerza de atracción (más fuerte cuando está lejos)
            const force = 0.03 + (1 - ease) * 0.015;
            this.vx += dx * force * 0.06;
            this.vy += dy * force * 0.06;
            
            // Amortiguación
            this.vx *= CONFIG.damping;
            this.vy *= CONFIG.damping;
            
            // Movimiento
            this.x += this.vx;
            this.y += this.vy;
            
            // Efecto de "flotación" aleatoria durante el viaje
            const wave = Math.sin(time * 0.003 + this.phase) * 0.2 * (1 - ease);
            this.x += wave * 0.3;
            this.y += Math.cos(time * 0.004 + this.phase * 1.3) * 0.2 * (1 - ease);
        }

        draw(ctx, time) {
            // Efecto de brillo
            const glow = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size * 2
            );
            glow.addColorStop(0, this.color);
            glow.addColorStop(1, 'transparent');
            
            ctx.shadowColor = this.color;
            ctx.shadowBlur = this.size * 2;
            
            // Dibujar cubito (cuadrado con esquinas redondeadas)
            const s = this.size;
            const r = 2;
            ctx.beginPath();
            ctx.moveTo(this.x - s + r, this.y - s);
            ctx.lineTo(this.x + s - r, this.y - s);
            ctx.quadraticCurveTo(this.x + s, this.y - s, this.x + s, this.y - s + r);
            ctx.lineTo(this.x + s, this.y + s - r);
            ctx.quadraticCurveTo(this.x + s, this.y + s, this.x + s - r, this.y + s);
            ctx.lineTo(this.x - s + r, this.y + s);
            ctx.quadraticCurveTo(this.x - s, this.y + s, this.x - s, this.y + s - r);
            ctx.lineTo(this.x - s, this.y - s + r);
            ctx.quadraticCurveTo(this.x - s, this.y - s, this.x - s + r, this.y - s);
            ctx.closePath();
            
            // Relleno
            ctx.fillStyle = this.color;
            ctx.fill();
            
            // Resplandor interior (efecto 3D)
            const grad = ctx.createLinearGradient(
                this.x - s, this.y - s,
                this.x + s, this.y + s
            );
            grad.addColorStop(0, 'rgba(255,255,255,0.15)');
            grad.addColorStop(0.5, 'rgba(255,255,255,0)');
            grad.addColorStop(1, 'rgba(0,0,0,0.15)');
            ctx.fillStyle = grad;
            ctx.fill();
            
            ctx.shadowBlur = 0;
        }
    }

    // ============================================================
    // INICIAR
    // ============================================================
    function initIntro() {
        // Calcular tamaño de fuente dinámico
        const fontSize = Math.min(W * 0.22, H * 0.45, 200);
        
        // Obtener posiciones de las letras "LDV"
        const text = 'LDV';
        targetPositions = getTextPixels(text, fontSize);
        
        // Reducir o aumentar partículas según sea necesario
        const targetCount = Math.min(targetPositions.length, CONFIG.particleCount);
        const step = Math.floor(targetPositions.length / targetCount);
        
        // Seleccionar posiciones aleatorias
        const selectedPositions = [];
        for (let i = 0; i < targetPositions.length; i += step) {
            if (Math.random() < 0.3 || selectedPositions.length < targetCount) {
                selectedPositions.push(targetPositions[i]);
            }
        }
        
        // Crear partículas
        particles = selectedPositions.map(pos => new Particle(pos.x, pos.y));
        
        // Iniciar animación
        const startTime = performance.now();
        let elapsed = 0;
        
        function animate(time) {
            elapsed = time - startTime;
            progress = Math.min(elapsed / CONFIG.animationDuration, 1);
            
            // Actualizar barra de progreso
            if (progressBar) {
                progressBar.style.width = (progress * 100) + '%';
            }
            
            // Limpiar canvas con fondo
            ctx.fillStyle = CONFIG.bgColor;
            ctx.fillRect(0, 0, W, H);
            
            // Actualizar y dibujar partículas
            particles.forEach(p => {
                p.update(time, progress);
                p.draw(ctx, time);
            });
            
            // Efecto de "estelas" o rastros
            if (progress < 0.8) {
                ctx.fillStyle = 'rgba(10,10,15,0.08)';
                ctx.fillRect(0, 0, W, H);
            }
            
            // Partículas de polvo/brillo que aparecen al final
            if (progress > 0.7 && progress < 1) {
                const sparkleCount = Math.floor((progress - 0.7) * 30);
                for (let i = 0; i < sparkleCount; i++) {
                    const idx = Math.floor(Math.random() * particles.length);
                    const p = particles[idx];
                    if (p) {
                        const s = 1 + Math.random() * 2;
                        ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.7})`;
                        ctx.shadowColor = '#fff';
                        ctx.shadowBlur = 10;
                        ctx.beginPath();
                        ctx.arc(
                            p.x + (Math.random() - 0.5) * 10,
                            p.y + (Math.random() - 0.5) * 10,
                            s, 0, Math.PI * 2
                        );
                        ctx.fill();
                        ctx.shadowBlur = 0;
                    }
                }
            }
            
            // Cuando se complete la animación
            if (progress >= 1 && !isComplete) {
                isComplete = true;
                
                // Crear destello
                if (flash) {
                    flash.classList.add('active');
                    setTimeout(() => {
                        flash.classList.remove('active');
                    }, 800);
                }
                
                // Ocultar overlay después del destello
                setTimeout(() => {
                    if (overlay) {
                        overlay.classList.add('hidden');
                    }
                    // Liberar recursos
                    if (animationFrame) {
                        cancelAnimationFrame(animationFrame);
                    }
                }, 500);
                
                // Disparar evento para que la página sepa que terminó
                document.dispatchEvent(new CustomEvent('introComplete'));
            }
            
            animationFrame = requestAnimationFrame(animate);
        }
        
        animationFrame = requestAnimationFrame(animate);
    }

    // ============================================================
    // ESPERAR A QUE LA PÁGINA ESTÉ LISTA
    // ============================================================
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initIntro();
    } else {
        document.addEventListener('DOMContentLoaded', initIntro);
    }

    // ============================================================
    // RESPONSIVE: reiniciar si cambia el tamaño (simple)
    // ============================================================
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (!isComplete) {
                // Solo redimensionar canvas, no reiniciar la animación
                resizeCanvas();
            }
        }, 300);
    });

})();
