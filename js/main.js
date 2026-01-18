/* ==========================================
   LOGICA JAVASCRIPT - HOTEL MAGLA
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Inicializar Iconos Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Control del Navbar (Transición Transparente a Blanco)
    const header = document.getElementById('main-header');
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    function updateHeader() {
        // Si bajamos más de 50px, añadimos clase scrolled (fondo blanco)
        // Si estamos arriba, quitamos clase (fondo transparente)
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            header.classList.remove('header-transparent');
        } else {
            header.classList.remove('scrolled');
            header.classList.add('header-transparent');
        }
    }

    if (header) {
        // Verificar estado inicial
        updateHeader();
        window.addEventListener('scroll', updateHeader);
    }

    // 3. Control del Menú Móvil
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            
            // Si abrimos el menú y estamos arriba (transparente), forzamos el estilo blanco
            // para que se lea el menú sobre el fondo blanco que añade el contenedor del menú
            if (!mobileMenu.classList.contains('hidden') && !header.classList.contains('scrolled')) {
                header.classList.add('scrolled'); // Truco visual para que el icono contraste
                header.classList.remove('header-transparent');
            } else if (window.scrollY <= 50) {
                // Si cerramos y estamos arriba, volvemos a transparente
                updateHeader();
            }
        });
    }

    // 4. Scroll Suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                if (mobileMenu) mobileMenu.classList.add('hidden');
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 5. Manejo del Formulario de Reservas (AJAX)
    const bookingForm = document.querySelector('form[action="enviar_reserva.php"]');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Evitar recarga de página

            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            
            // Cambiar estado del botón
            submitBtn.disabled = true;
            submitBtn.innerText = "Enviando...";
            submitBtn.classList.add('opacity-75', 'cursor-not-allowed');

            // Recoger datos
            const formData = new FormData(bookingForm);

            // Enviar con Fetch
            fetch('reservas.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('✅ ' + data.message);
                    bookingForm.reset(); // Limpiar formulario
                } else {
                    alert('❌ Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un problema al enviar la solicitud. Por favor intenta nuevamente o contáctanos por WhatsApp.');
            })
            .finally(() => {
                // Restaurar botón
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
                submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
            });
        });
    }
});