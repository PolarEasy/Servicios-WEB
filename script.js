// ============ MENÚ HAMBURGUESA ============
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });

        // Cerrar al hacer clic en un enlace (móvil)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }

    // ============ AÑO EN FOOTER ============
    const footerYear = document.querySelector('footer .footer-copy p');
    if (footerYear) {
        const year = new Date().getFullYear();
        footerYear.textContent = `© ${year} Luis Diosvan · Hecho con ❤️ y código`;
    }

    // ============ SCROLL SUAVE (opcional) ============
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

    console.log('🚀 Página de Luis Diosvan cargada con éxito');
});
