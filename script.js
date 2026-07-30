// Efecto de escritura en el título (opcional)
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Página de servicios profesional cargada');

    // Agregar año automático en el footer
    const footer = document.querySelector('footer p');
    if (footer) {
        const year = new Date().getFullYear();
        footer.innerHTML = `&copy; ${year} MiDev - Hecho con ❤️ y código`;
    }

    // Botones de "Próximamente" - efecto al hacer clic
    const buttons = document.querySelectorAll('.btn-download');
    buttons.forEach(btn => {
        if (btn.textContent === 'Próximamente') {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                btn.textContent = '🚀 En desarrollo...';
                btn.style.background = '#6c63ff';
                btn.style.color = 'white';
                setTimeout(() => {
                    btn.textContent = 'Próximamente';
                    btn.style.background = '#1e1e2a';
                    btn.style.color = '#a0a0b0';
                }, 2000);
            });
        }
    });
});