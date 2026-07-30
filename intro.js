// ============================================================
// INTRO LEGO 2D - Cubitos que encajan como piezas
// ============================================================

(function() {
    'use strict';

    // ============================================================
    // CONFIGURACIÓN
    // ============================================================
    const CONFIG = {
        particleCount: 750,             // Cubitos totales
        letterSpacing: 0.85,            // Separación entre letras
        animationDuration: 3200,        // ms totales
        cubeSize: 4.2,                  // Tamaño base de cada cubito
        colors: [
            '#7c6bff', '#8b7bfa', '#9a8bf8',
            '#a78bfa', '#b89cfc', '#c9adfe',
            '#6a59e8', '#5a49d8'
        ],
        bgColor: '#0a0a0f',
        gravity: 0.008,
        damping: 0.97,
        snapDistance: 2.5,              // Distancia para "encajar" con click
    };

    // ============================================================
    // DOM REFS
    // ============================================================
    const overlay = document.getElementById('introOverlay');
    const canvas = document.getElementById('introCanvas');
    const ctx = canvas.getContext('2d');
    const flash = document.querySelector('.intro-flash');

    // ============================================================
    // DIMENSIONES
    // ============================================================
    let W, H;
    let dpr = 1;

    function resizeCanvas() {
        dpr = window.devicePixelRatio || 1;
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.scale(dpr, dpr);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // ============================================================
    // OBTENER PÍXELES DEL TEXTO "LDV"
    // ============================================================
    function getTextPixels(text, fontSize) {
        const offscreen = document.createElement('canvas');
        const offCtx = offscreen.getContext('2d');
        
        offscreen.width = Math.floor(W * 0.9);
        offscreen.height = Math.floor(H * 0.6);
        
        offCtx.fillStyle = '#000';
        offCtx.fillRect(0, 0, offscreen.width, offscreen.height);
        
        const font = `800 ${fontSize}px 'Inter', 'Arial', sans-serif`;
        offCtx.font = font;
        offCtx.textAlign = 'center';
        offCtx.textBaseline = 'middle';
        offCtx.fillStyle = '#fff';
        offCtx.shadowColor = 'rgba(255,255,255,0.1)';
        offCtx.shadowBlur = 4;
        offCtx.fillText(text, offscreen.width / 2, offscreen.height / 2);
        
        const imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
        const data = imageData.data;
        
        const positions = [];
        const step = 2;
        
        for (let y = 0; y < offscreen.height; y += step) {
            for (let x = 0; x < offscreen.width; x += step) {
                const index = (y * offscreen.width + x) * 4;
                if (data[index] > 128) {
                    const px = (x / offscreen.width) * W;
                    const py = (y / offscreen.height) * H;
                    positions.push({ x: px, y: py });
                }
            }
        }
        
        return positions;
    }

    // ============================================================
    // SISTEMA DE PARTÍCULAS (Cubitos LEGO)
    // ============================================================
    let particles = [];
    let progress = 0;
    let isComplete = false;
    let animationFrame = null;
    let clickEffects = [];
    let sparkles = [];

    // ============================================================
    // CLASE CUBITO LEGO
    // ============================================================
    class LegoParticle {
        constructor(targetX, targetY, index, total) {
            this.targetX = targetX;
            this.targetY = targetY;
            this.index = index;
            this.total = total;
            
            // Posición inicial: desde los bordes con distribución aleatoria
            const side = Math.random() < 0.5 ? 'left' : 'right';
            const offsetY = (Math.random() - 0.5) * H * 0.4;
            
            if (side === 'left') {
                this.x = -W * (0.2 + Math.random() * 0.3);
                this.y = H * 0.5 + offsetY;
            } else {
                this.x = W * (1 + 0.2 + Math.random() * 0.3);
                this.y = H * 0.5 + offsetY;
            }
            
            // Velocidad inicial - más rápida desde los bordes
            const speed = 2 + Math.random() * 3.5;
            const angle = (Math.random() - 0.5) * 1.2;
            const dir = side === 'left' ? 1 : -1;
            this.vx = dir * speed * (0.8 + Math.random() * 0.4);
            this.vy = (Math.random() - 0.5) * speed * 0.6;
            
            // Tamaño - variación LEGO
            this.size = CONFIG.cubeSize * (0.7 + Math.random() * 0.7);
            
            // Color - paleta LEGO
            this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
            
            // Fase única para efectos
            this.phase = Math.random() * Math.PI * 2;
            this.delay = (Math.random() * 300) + (index / total) * 200;
            
            // Estado de "encaje"
            this.snapped = false;
            this.snapTime = 0;
            this.snapOffsetX = 0;
            this.snapOffsetY = 0;
            
            // Rotación (estilo LEGO)
            this.rotation = (Math.random() - 0.5) * 0.5;
            this.rotationSpeed = (Math.random() - 0.5) * 0.03;
            
            // Brillo
            this.glowIntensity = 0.2 + Math.random() * 0.3;
        }

        update(time, progress) {
            const p = Math.min(progress, 1);
            
            // Easing suave (cubic bezier aproximado)
            const ease = p < 0.5 
                ? 4 * p * p * p 
                : 1 - Math.pow(-2 * p + 2, 3) / 2;
            
            // Si ya está encajada, vibración mínima
            if (this.snapped) {
                const vib = 0.15;
                const t = time * 0.002;
                this.x = this.targetX + Math.sin(t * 1.3 + this.phase) * vib;
                this.y = this.targetY + Math.cos(t * 1.7 + this.phase * 0.7) * vib;
                this.rotation += Math.sin(t * 0.5 + this.phase) * 0.0002;
                
                // Efecto "click" - partículas de polvo
                if (this.snapTime === 0) {
                    this.snapTime = time;
                    // Generar chispas
                    for (let i = 0; i < 3; i++) {
                        sparkles.push({
                            x: this.targetX + (Math.random() - 0.5) * 8,
                            y: this.targetY + (Math.random() - 0.5) * 8,
                            vx: (Math.random() - 0.5) * 2,
                            vy: -Math.random() * 2 - 0.5,
                            life: 1,
                            size: 1 + Math.random() * 2,
                            color: this.color
                        });
                    }
                }
                return;
            }
            
            // --- Movimiento hacia el target ---
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Si está muy cerca, encaja con "click"
            if (dist < CONFIG.snapDistance && p > 0.3) {
                this.snapped = true;
                this.snapTime = 0;
                this.x = this.targetX;
                this.y = this.targetY;
                return;
            }
            
            // Fuerza de atracción - aumenta con el tiempo
            const attraction = 0.04 + ease * 0.06;
            const forceX = dx * attraction * 0.05;
            const forceY = dy * attraction * 0.05;
            
            this.vx += forceX;
            this.vy += forceY;
            
            // Amortiguación
            this.vx *= CONFIG.damping;
            this.vy *= CONFIG.damping;
            
            // Gravedad suave
            this.vy += CONFIG.gravity * (1 - ease * 0.5);
            
            // Movimiento
            this.x += this.vx;
            this.y += this.vy;
            
            // Rotación - se alinea con el movimiento
            this.rotation += this.vx * 0.002 + this.vy * 0.001;
            this.rotation *= 0.99;
            
            // Efecto de flotación durante el viaje
            const waveAmp = 0.3 * (1 - ease);
            this.x += Math.sin(time * 0.002 + this.phase) * waveAmp;
            this.y += Math.cos(time * 0.0025 + this.phase * 0.7) * waveAmp * 0.6;
        }

        draw(ctx, time) {
            const s = this.size;
            const r = s * 0.3; // Radio de esquina
            
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            
            // === Sombra (efecto 2D LEGO) ===
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.shadowBlur = s * 0.5;
            ctx.shadowOffsetX = s * 0.15;
            ctx.shadowOffsetY = s * 0.2;
            
            // === Cuerpo del cubito ===
            ctx.beginPath();
            ctx.moveTo(-s + r, -s);
            ctx.lineTo(s - r, -s);
            ctx.quadraticCurveTo(s, -s, s, -s + r);
            ctx.lineTo(s, s - r);
            ctx.quadraticCurveTo(s, s, s - r, s);
            ctx.lineTo(-s + r, s);
            ctx.quadraticCurveTo(-s, s, -s, s - r);
            ctx.lineTo(-s, -s + r);
            ctx.quadraticCurveTo(-s, -s, -s + r, -s);
            ctx.closePath();
            
            // Relleno base
            ctx.fillStyle = this.color;
            ctx.fill();
            
            // === Borde (efecto LEGO) ===
            ctx.strokeStyle = 'rgba(255,255,255,0.08)';
            ctx.lineWidth = 0.5;
            ctx.stroke();
            
            // === Brillo (efecto 2D) ===
            const grad = ctx.createLinearGradient(-s, -s, s, s);
            grad.addColorStop(0, 'rgba(255,255,255,0.2)');
            grad.addColorStop(0.3, 'rgba(255,255,255,0.05)');
            grad.addColorStop(0.7, 'rgba(0,0,0,0.05)');
            grad.addColorStop(1, 'rgba(0,0,0,0.15)');
            ctx.fillStyle = grad;
            ctx.fill();
            
            // === Punto de conexión LEGO (top) ===
            if (s > 2) {
                ctx.beginPath();
                ctx.arc(0, -s * 0.6, s * 0.15, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.05)';
                ctx.fill();
            }
            
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            
            ctx.restore();
        }
    }

    // ============================================================
    // GENERAR CHISPAS (efecto click)
    // ============================================================
    function drawSparkles(ctx, time) {
        for (let i = sparkles.length - 1; i >= 0; i--) {
            const s = sparkles[i];
            s.x += s.vx;
            s.y += s.vy;
            s.vy += 0.04;
            s.life -= 0.015;
            
            if (s.life <= 0) {
                sparkles.splice(i, 1);
                continue;
            }
            
            ctx.globalAlpha = s.life * 0.8;
            ctx.fillStyle = s.color;
            ctx.shadowColor = s.color;
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        }
    }

    // ============================================================
    // EFECTO DE "POLVO" EN EL FONDO
    // ============================================================
    function drawDust(ctx, time) {
        for (let i = 0; i < 20; i++) {
            const x = (Math.sin(time * 0.0003 + i * 2.7) * 0.5 + 0.5) * W;
            const y = (Math.cos(time * 0.0004 + i * 3.1) * 0.5 + 0.5) * H;
            const size = 1 + Math.sin(time * 0.001 + i) * 0.5;
            ctx.fillStyle = `rgba(124,107,255,${0.02 + Math.sin(time * 0.0005 + i) * 0.01})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // ============================================================
    // BARRA DE PROGRESO LEGO
    // ============================================================
    function updateProgressBar(p) {
        const container = document.querySelector('.intro-progress');
        if (!container) return;
        
        const blocks = container.querySelectorAll('.intro-progress-block');
        const total = blocks.length;
        const active = Math.floor(p * total);
        
        blocks.forEach((block, i) => {
            block.classList.remove('active', 'done');
            if (i < active) {
                block.classList.add('done');
            }
            if (i === active && p < 1) {
                block.classList.add('active');
            }
        });
    }

    // ============================================================
    // INICIALIZAR
    // ============================================================
    function initIntro() {
        const fontSize = Math.min(W * 0.22, H * 0.42, 180);
        
        // Obtener posiciones del texto "LDV"
        const targetPositions = getTextPixels('LDV', fontSize);
        
        // Seleccionar posiciones
        const targetCount = Math.min(targetPositions.length, CONFIG.particleCount);
        const selectedPositions = [];
        const step = Math.floor(targetPositions.length / targetCount);
        
        for (let i = 0; i < targetPositions.length && selectedPositions.length < targetCount; i += step) {
            if (Math.random() < 0.3 || selectedPositions.length < targetCount * 0.7) {
                selectedPositions.push(targetPositions[i]);
            }
        }
        
        // Crear partículas
        particles = selectedPositions.map((pos, i) => 
            new LegoParticle(pos.x, pos.y, i, selectedPositions.length)
        );
        
        // Crear barra de progreso LEGO
        const progressContainer = document.querySelector('.intro-progress');
        if (progressContainer) {
            progressContainer.innerHTML = '';
            for (let i = 0; i < 30; i++) {
                const block = document.createElement('div');
                block.className = 'intro-progress-block';
                progressContainer.appendChild(block);
            }
        }
        
        // Iniciar animación
        const startTime = performance.now();
        let elapsed = 0;
        
        function animate(time) {
            elapsed = time - startTime;
            progress = Math.min(elapsed / CONFIG.animationDuration, 1);
            
            // Actualizar barra de progreso
            updateProgressBar(progress);
            
            // Limpiar canvas
            ctx.fillStyle = CONFIG.bgColor;
            ctx.fillRect(0, 0, W, H);
            
            // Fondo con efecto de "profundidad"
            drawDust(ctx, time);
            
            // Actualizar y dibujar partículas
            particles.forEach(p => {
                p.update(time, progress);
                p.draw(ctx, time);
            });
            
            // Dibujar chispas (efecto click)
            drawSparkles(ctx, time);
            
            // Efecto de "sombra de texto" cuando está casi completo
            if (progress > 0.85 && progress < 1) {
                ctx.fillStyle = `rgba(124,107,255,${(progress - 0.85) * 0.03})`;
                ctx.fillRect(0, 0, W, H);
            }
            
            // === DESTELLO FINAL ===
            if (progress >= 1 && !isComplete) {
                isComplete = true;
                
                // Destello
                if (flash) {
                    flash.classList.add('active');
                    setTimeout(() => {
                        flash.classList.remove('active');
                    }, 900);
                }
                
                // Ocultar overlay
                setTimeout(() => {
                    if (overlay) {
                        overlay.classList.add('hidden');
                    }
                    if (animationFrame) {
                        cancelAnimationFrame(animationFrame);
                    }
                }, 500);
                
                document.dispatchEvent(new CustomEvent('introComplete'));
            }
            
            animationFrame = requestAnimationFrame(animate);
        }
        
        animationFrame = requestAnimationFrame(animate);
    }

    // ============================================================
    // INICIO
    // ============================================================
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(initIntro, 100);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initIntro, 100);
        });
    }

    // ============================================================
    // RESPONSIVE
    // ============================================================
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (!isComplete) {
                resizeCanvas();
            }
        }, 300);
    });

})();
