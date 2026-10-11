document.addEventListener("DOMContentLoaded", async () => {
    const modules = [
        { id: 'header-container', file: 'html/header.html', callback: inicializarMenuMovil },
        { id: 'hero-container', file: 'html/hero.html' },
        { id: 'about-container', file: 'html/about.html' },
        { id: 'projects-container', file: 'html/projects.html' },
        { id: 'pixelart-container', file: 'html/pixelart.html' },
        { id: 'contact-container', file: 'html/contact.html', callback: inicializarFormularioContacto }
    ];

    try {
        await Promise.all(modules.map(async (mod) => {
            const res = await fetch(mod.file);
            if (!res.ok) throw new Error(`Error cargando ${mod.file}`);
            const html = await res.text();
            const el = document.getElementById(mod.id);
            if (el) el.innerHTML = html;
            if (mod.callback) mod.callback();
        }));
    } catch (err) {
        console.error("Error al cargar componentes:", err);
    }
});

function inicializarMenuMovil() {
    const menuBtn = document.getElementById('menuBtn');
    const navMenu = document.getElementById('navMenu');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

function inicializarFormularioContacto() {
    const form = document.getElementById('contactForm');
    const statusDiv = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que la página cambie de URL

        // 1. Mostrar estado de enviando
        submitBtn.disabled = true;
        submitBtn.innerText = "⏳ Enviando...";
        statusDiv.style.display = "block";
        statusDiv.className = "form-status pending";
        statusDiv.innerHTML = "&gt; PROCESANDO_MENSAJE... POR FAVOR ESPERA.";

        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // 2. Éxito al enviar
                statusDiv.className = "form-status success";
                statusDiv.innerHTML = "&gt; ¡ÉXITO! Tu mensaje ha sido enviado correctamente. Responderé lo antes posible.";
                form.reset(); // Limpia los campos
            } else {
                // 3. Error devuelto por el servidor
                statusDiv.className = "form-status error";
                statusDiv.innerHTML = "&gt; ERROR: Ocurrió un problema al enviar el mensaje. Inténtalo de nuevo.";
            }
        } catch (error) {
            // 4. Error de red
            statusDiv.className = "form-status error";
            statusDiv.innerHTML = "&gt; ERROR_DE_CONEXIÓN: Comprueba tu red e inténtalo de nuevo.";
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = "🚀 Enviar Mensaje";
        }
    });
}