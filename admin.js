// ============================================================
// ADMIN.JS - Autenticación y gestión del panel
// ============================================================

// ============================================================
// CREDENCIALES POR DEFECTO (CAMBIAR ESTAS)
// ============================================================
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'LD2026Admin'
};

// ============================================================
// LOGIN
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const user = document.getElementById('adminUser').value.trim();
            const pass = document.getElementById('adminPass').value.trim();
            const errorEl = document.getElementById('loginError');

            // Verificar credenciales
            if (user === ADMIN_CREDENTIALS.username && pass === ADMIN_CREDENTIALS.password) {
                // Autenticación exitosa
                localStorage.setItem('adminAuthenticated', 'true');
                localStorage.setItem('adminName', user);
                window.location.href = 'admin-panel.html';
            } else {
                errorEl.textContent = '⚠️ Usuario o contraseña incorrectos';
                errorEl.classList.add('show');
                document.getElementById('adminPass').value = '';
                document.getElementById('adminPass').focus();
            }
        });
    }

    // ============================================================
    // VERIFICAR AUTENTICACIÓN EN PÁGINAS PROTEGIDAS
    // ============================================================
    const isAdmin = localStorage.getItem('adminAuthenticated') === 'true';
    const currentPage = window.location.pathname;

    // Si está en admin-panel.html y no está autenticado, redirigir al login
    if (currentPage.includes('admin-panel.html') && !isAdmin) {
        window.location.href = 'admin.html';
    }

    // Si está en admin.html y ya está autenticado, redirigir al panel
    if (currentPage.includes('admin.html') && isAdmin) {
        window.location.href = 'admin-panel.html';
    }

    // ============================================================
    // ACCESO OCULTO: Doble clic en el logo (para entrar al admin)
    // ============================================================
    const logo = document.querySelector('.logo');
    if (logo && !currentPage.includes('admin')) {
        let clickCount = 0;
        let clickTimer = null;

        logo.addEventListener('click', function(e) {
            clickCount++;

            if (clickCount === 1) {
                clickTimer = setTimeout(function() {
                    clickCount = 0;
                }, 500);
            }

            if (clickCount === 3) {
                clearTimeout(clickTimer);
                clickCount = 0;
                // Redirigir al admin
                window.location.href = 'admin.html';
            }
        });
    }

    // ============================================================
    // TOAST NOTIFICATIONS
    // ============================================================
    function showToast(message, duration = 3000) {
        const toast = document.getElementById('toast');
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(function() {
            toast.classList.remove('show');
        }, duration);
    }

    // ============================================================
    // EXPORTAR FUNCIONES PARA USO EN OTROS SCRIPTS
    // ============================================================
    window.showToast = showToast;
    window.ADMIN_CREDENTIALS = ADMIN_CREDENTIALS;
});
