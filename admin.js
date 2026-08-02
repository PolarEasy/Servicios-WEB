// ============================================================
// ADMIN.JS - Autenticación y gestión del panel
// ============================================================

// ============================================================
// CONFIGURACIÓN DE SEGURIDAD
// ============================================================

// CÓDIGO DE ACCESO ÚNICO (CAMBIAR ESTE)
// Solo el administrador debe conocer este código
// Para cambiarlo, se necesita el código actual
const MASTER_CODE = 'LDV-2026-SECURE';

// CREDENCIALES DEL ADMINISTRADOR
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'LD2026Admin'
};

// ============================================================
// SISTEMA DE CÓDIGO - CAMBIO SEGURO
// ============================================================

// Obtener el código guardado o usar el predeterminado
function getStoredCode() {
    const stored = localStorage.getItem('adminMasterCode');
    if (stored) {
        return stored;
    }
    // Si no existe, guardar el código predeterminado
    localStorage.setItem('adminMasterCode', MASTER_CODE);
    return MASTER_CODE;
}

// Verificar si el código es correcto
function verifyCode(inputCode) {
    const storedCode = getStoredCode();
    return inputCode === storedCode;
}

// Cambiar el código (requiere el código actual)
function changeCode(oldCode, newCode) {
    if (!verifyCode(oldCode)) {
        return { success: false, message: 'Código actual incorrecto' };
    }
    if (newCode.length < 6) {
        return { success: false, message: 'El nuevo código debe tener al menos 6 caracteres' };
    }
    if (newCode === oldCode) {
        return { success: false, message: 'El nuevo código debe ser diferente al actual' };
    }
    localStorage.setItem('adminMasterCode', newCode);
    return { success: true, message: 'Código actualizado correctamente' };
}

// ============================================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================================

function isAuthenticated() {
    return localStorage.getItem('adminAuthenticated') === 'true';
}

function login(username, password) {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminName', username);
        return { success: true };
    }
    return { success: false, message: 'Usuario o contraseña incorrectos' };
}

function logout() {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminName');
    window.location.href = 'admin.html';
}

// ============================================================
// ACCESO OCULTO: 5 CLICS EN EL LOGO
// ============================================================

function initHiddenAccess() {
    const logo = document.querySelector('.logo');
    if (!logo) return;

    let clickCount = 0;
    let clickTimer = null;

    logo.style.cursor = 'default';

    logo.addEventListener('click', function(e) {
        clickCount++;

        if (clickCount === 1) {
            clickTimer = setTimeout(function() {
                clickCount = 0;
            }, 800);
        }

        if (clickCount === 5) {
            clearTimeout(clickTimer);
            clickCount = 0;
            // Mostrar modal para el código de acceso
            showCodeModal();
        }
    });
}

// ============================================================
// MODAL PARA CÓDIGO DE ACCESO
// ============================================================

function showCodeModal() {
    // Eliminar modal existente
    const existingModal = document.getElementById('codeModal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'codeModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    modal.innerHTML = `
        <div style="
            background: rgba(20, 20, 35, 0.9);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            padding: 48px 40px;
            border-radius: 28px;
            border: 1px solid rgba(255, 255, 255, 0.06);
            max-width: 420px;
            width: 90%;
            box-shadow: 0 40px 80px rgba(0, 0, 0, 0.5);
            text-align: center;
        ">
            <div style="font-size:3rem;margin-bottom:8px;">🔐</div>
            <h2 style="font-size:1.4rem;margin-bottom:4px;">Acceso restringido</h2>
            <p style="color:#808090;font-size:0.9rem;margin-bottom:24px;">
                Ingresa el código de acceso para continuar
            </p>
            <form id="codeForm">
                <input type="password" id="codeInput" placeholder="Código de acceso" style="
                    width: 100%;
                    padding: 14px 18px;
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 12px;
                    color: #fff;
                    font-size: 1.1rem;
                    font-family: 'Inter', sans-serif;
                    text-align: center;
                    letter-spacing: 4px;
                    transition: border-color 0.3s, box-shadow 0.3s;
                    margin-bottom: 16px;
                " autofocus />
                <div id="codeError" style="
                    color: #ff6b6b;
                    font-size: 0.85rem;
                    display: none;
                    margin-bottom: 16px;
                "></div>
                <button type="submit" style="
                    width: 100%;
                    padding: 14px;
                    background: #7c6bff;
                    color: #fff;
                    border: none;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                    font-family: 'Inter', sans-serif;
                    cursor: pointer;
                    transition: background 0.3s, transform 0.2s;
                ">Verificar →</button>
            </form>
            <button id="codeCancel" style="
                margin-top: 14px;
                background: transparent;
                color: #606070;
                border: none;
                font-size: 0.85rem;
                font-family: 'Inter', sans-serif;
                cursor: pointer;
                transition: color 0.3s;
            ">Cancelar</button>
            <p style="color:#404050;font-size:0.65rem;margin-top:16px;border-top:1px solid rgba(255,255,255,0.04);padding-top:16px;">
                🔒 Acceso exclusivo para administradores
            </p>
        </div>
    `;

    document.body.appendChild(modal);

    // Enfocar el input
    setTimeout(() => {
        document.getElementById('codeInput').focus();
    }, 200);

    // Eventos
    document.getElementById('codeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const code = document.getElementById('codeInput').value.trim();
        const errorEl = document.getElementById('codeError');

        if (!code) {
            errorEl.textContent = '⚠️ Ingresa el código de acceso';
            errorEl.style.display = 'block';
            return;
        }

        if (verifyCode(code)) {
            // Código correcto - redirigir al login
            modal.remove();
            window.location.href = 'admin.html';
        } else {
            errorEl.textContent = '❌ Código incorrecto. Intenta de nuevo.';
            errorEl.style.display = 'block';
            document.getElementById('codeInput').value = '';
            document.getElementById('codeInput').focus();
        }
    });

    document.getElementById('codeCancel').addEventListener('click', function() {
        modal.remove();
    });

    // Cerrar con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modal.remove();
        }
    });

    // Cerrar al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ============================================================
// FUNCIÓN PARA CAMBIAR EL CÓDIGO DESDE EL PANEL
// ============================================================

function showChangeCodeModal() {
    const overlay = document.createElement('div');
    overlay.id = 'changeCodeModal';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    overlay.innerHTML = `
        <div style="
            background: rgba(20, 20, 35, 0.9);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            padding: 40px 36px;
            border-radius: 28px;
            border: 1px solid rgba(255, 255, 255, 0.06);
            max-width: 420px;
            width: 90%;
            box-shadow: 0 40px 80px rgba(0, 0, 0, 0.5);
        ">
            <h2 style="font-size:1.3rem;margin-bottom:4px;">🔑 Cambiar código de acceso</h2>
            <p style="color:#808090;font-size:0.85rem;margin-bottom:20px;">
                Ingresa el código actual y el nuevo código
            </p>
            <form id="changeCodeForm">
                <label style="display:block;font-size:0.8rem;font-weight:600;color:#b0b0c0;margin-bottom:4px;">Código actual</label>
                <input type="password" id="oldCodeInput" placeholder="Código actual" style="
                    width: 100%;
                    padding: 12px 16px;
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 12px;
                    color: #fff;
                    font-size: 1rem;
                    font-family: 'Inter', sans-serif;
                    transition: border-color 0.3s;
                    margin-bottom: 14px;
                " />
                <label style="display:block;font-size:0.8rem;font-weight:600;color:#b0b0c0;margin-bottom:4px;">Nuevo código</label>
                <input type="text" id="newCodeInput" placeholder="Nuevo código (mínimo 6 caracteres)" style="
                    width: 100%;
                    padding: 12px 16px;
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 12px;
                    color: #fff;
                    font-size: 1rem;
                    font-family: 'Inter', sans-serif;
                    transition: border-color 0.3s;
                    margin-bottom: 14px;
                " />
                <div id="changeCodeError" style="color:#ff6b6b;font-size:0.85rem;display:none;margin-bottom:12px;"></div>
                <div style="display:flex;gap:12px;justify-content:flex-end;">
                    <button type="button" id="changeCodeCancel" style="
                        background: rgba(255,255,255,0.04);
                        color: #a0a0b0;
                        padding: 10px 24px;
                        border-radius: 40px;
                        border: 1px solid rgba(255,255,255,0.06);
                        cursor: pointer;
                        font-family: 'Inter', sans-serif;
                        font-weight: 500;
                        transition: background 0.3s;
                    ">Cancelar</button>
                    <button type="submit" style="
                        background: #7c6bff;
                        color: #fff;
                        padding: 10px 28px;
                        border: none;
                        border-radius: 40px;
                        font-size: 0.9rem;
                        font-weight: 600;
                        font-family: 'Inter', sans-serif;
                        cursor: pointer;
                        transition: background 0.3s;
                    ">Cambiar código</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('changeCodeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const oldCode = document.getElementById('oldCodeInput').value.trim();
        const newCode = document.getElementById('newCodeInput').value.trim();
        const errorEl = document.getElementById('changeCodeError');

        if (!oldCode || !newCode) {
            errorEl.textContent = '⚠️ Completa todos los campos';
            errorEl.style.display = 'block';
            return;
        }

        const result = changeCode(oldCode, newCode);
        if (result.success) {
            overlay.remove();
            showToast('✅ ' + result.message, 3000);
        } else {
            errorEl.textContent = '❌ ' + result.message;
            errorEl.style.display = 'block';
            document.getElementById('oldCodeInput').value = '';
            document.getElementById('oldCodeInput').focus();
        }
    });

    document.getElementById('changeCodeCancel').addEventListener('click', function() {
        overlay.remove();
    });

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================

function showToast(message, duration = 3000) {
    const existing = document.querySelector('.toast');
    if (existing) {
        existing.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: rgba(20, 20, 35, 0.9);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        padding: 16px 28px;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.06);
        color: #fff;
        font-size: 0.95rem;
        font-family: 'Inter', sans-serif;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        z-index: 99999;
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.4s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Forzar reflow
    toast.offsetHeight;

    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function() {
        toast.style.transform = 'translateY(20px)';
        toast.style.opacity = '0';
        setTimeout(function() {
            toast.remove();
        }, 400);
    }, duration);
}

// ============================================================
// INICIALIZAR
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar acceso oculto (5 clics)
    initHiddenAccess();

    // Si estamos en admin-panel.html, mostrar opción para cambiar código
    if (window.location.pathname.includes('admin-panel.html')) {
        const adminGrid = document.querySelector('.admin-grid');
        if (adminGrid) {
            // Buscar la tarjeta de reset y agregar una de cambio de código
            const cards = adminGrid.querySelectorAll('.admin-card');
            let resetCard = null;
            cards.forEach(function(card) {
                if (card.dataset.section === 'reset') {
                    resetCard = card;
                }
            });

            if (resetCard) {
                // Insertar antes de reset
                const codeCard = document.createElement('div');
                codeCard.className = 'admin-card';
                codeCard.dataset.section = 'change-code';
                codeCard.style.cssText = 'border-color:rgba(124,107,255,0.15);';
                codeCard.innerHTML = `
                    <div class="card-icon">🔑</div>
                    <h3>Cambiar código de acceso</h3>
                    <p>Modifica el código de 5 clics. Necesitas el código actual.</p>
                    <span class="card-status">✓ Seguro</span>
                `;
                codeCard.addEventListener('click', function() {
                    showChangeCodeModal();
                });
                resetCard.parentNode.insertBefore(codeCard, resetCard);
            }
        }
    }

    // Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const user = document.getElementById('adminUser').value.trim();
            const pass = document.getElementById('adminPass').value.trim();
            const errorEl = document.getElementById('loginError');

            if (!user || !pass) {
                errorEl.textContent = '⚠️ Ingresa usuario y contraseña';
                errorEl.classList.add('show');
                return;
            }

            const result = login(user, pass);
            if (result.success) {
                window.location.href = 'admin-panel.html';
            } else {
                errorEl.textContent = '❌ ' + result.message;
                errorEl.classList.add('show');
                document.getElementById('adminPass').value = '';
                document.getElementById('adminPass').focus();
            }
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logout();
        });
    }

    // Verificar autenticación
    const isAuth = isAuthenticated();
    const currentPage = window.location.pathname;

    if (currentPage.includes('admin-panel.html') && !isAuth) {
        window.location.href = 'admin.html';
    }

    if (currentPage.includes('admin.html') && isAuth) {
        window.location.href = 'admin-panel.html';
    }

    console.log('🔒 Sistema de seguridad activado');
});
