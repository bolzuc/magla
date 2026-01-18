/* ==========================================
   LOGICA JAVASCRIPT - HOTEL MAGLA
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Inicializar Iconos Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==========================================
    // 2. NAVBAR DINÁMICO (Scroll Effect)
    // ==========================================
    const header = document.getElementById('main-header');
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    function updateHeader() {
        if (!header) return;
        
        // Si bajamos más de 50px O si el menú móvil está abierto
        if (window.scrollY > 50 || (mobileMenu && !mobileMenu.classList.contains('hidden'))) {
            header.classList.add('scrolled');
            header.classList.remove('header-transparent');
        } else {
            header.classList.remove('scrolled');
            header.classList.add('header-transparent');
        }
    }

    if (header) {
        updateHeader(); // Estado inicial
        window.addEventListener('scroll', updateHeader);
    }

    // Toggle Menú Móvil
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            updateHeader(); // Forzar actualización de color al abrir/cerrar
        });
    }

    // Scroll Suave para anclas
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                    updateHeader();
                }
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ==========================================
    // 3. GALERÍA FILTRABLE (Bento/Grid)
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                
                // 1. GESTIÓN DE CLASES DE LOS BOTONES
                filterButtons.forEach(b => {
                    // Resetear a estilo inactivo (Gris claro)
                    b.classList.remove('bg-wine', 'text-white', 'shadow-lg');
                    b.classList.add('bg-gray-100', 'text-gray-700', 'hover-beige'); 
                    // Nota: 'hover-beige' es la clase CSS personalizada que da el hover beige/vino
                });

                // Activar el botón clicado (Vino sólido)
                btn.classList.remove('bg-gray-100', 'text-gray-700', 'hover-beige');
                btn.classList.add('bg-wine', 'text-white', 'shadow-lg');

                // 2. FILTRAR IMÁGENES
                const filterValue = btn.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    
                    if (filterValue === 'todo' || itemCategory === filterValue) {
                        item.style.display = 'block'; // Usamos block/inline-block según layout
                        // Pequeña animación
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // ==========================================
    // 4. RESERVAS (Híbrido: PHP + WhatsApp Fallback)
    // ==========================================
    const bookingForm = document.querySelector('form[action="reservas.php"]');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Detener envío tradicional

            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            
            // UX: Deshabilitar botón
            submitBtn.disabled = true;
            submitBtn.innerText = "Procesando...";
            submitBtn.classList.add('opacity-75', 'cursor-not-allowed');

            // Recoger datos
            const formData = new FormData(bookingForm);
            
            // Preparar Datos para WhatsApp (Plan B)
            const nombre = formData.get('nombre');
            const fecha = formData.get('llegada');
            const habitacion = formData.get('habitacion');
            const waNumber = "582718811928";
            const waMessage = `Hola Hotel Magla, quiero reservar.%0A%0A*Nombre:* ${nombre}%0A*Fecha:* ${fecha}%0A*Habitación:* ${habitacion}%0A%0AEnviado desde la web.`;
            const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

            // Intentar enviar a PHP
            fetch('reservas.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('✅ ¡Solicitud Enviada! Te contactaremos pronto al correo/teléfono.');
                    bookingForm.reset();
                } else {
                    if(confirm('⚠️ Hubo un detalle técnico enviando el correo.\n\n¿Deseas enviar tu reserva por WhatsApp ahora mismo?')) {
                        window.open(waLink, '_blank');
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                if(confirm('No pudimos conectar con el servidor de correos.\n\n¿Enviar solicitud por WhatsApp?')) {
                    window.open(waLink, '_blank');
                }
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
                submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
            });
        });
    }
});