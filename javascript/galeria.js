document.addEventListener("DOMContentLoaded", async () => {
    const repoOwner = "LuisPM22";
    const repoName = "mi-portafolio";
    const folderPath = "images/galeria"; // Carpeta donde guardarás tus imágenes
    const container = document.getElementById("pinterest-container");

    if (!container) return;

    try {
        // Consultar la API pública de GitHub para listar los archivos de la carpeta
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`);
        
        if (!response.ok) {
            throw new Error("No se pudo conectar con el repositorio para listar los assets.");
        }

        const files = await response.json();

        // Filtrar solo archivos de imagen (png, jpg, gif, webp)
        const imageFiles = files.filter(file => 
            file.type === "file" && /\.(jpe?g|png|gif|webp)$/i.test(file.name)
        );

        // Limpiar el texto de "Cargando..."
        container.innerHTML = "";

        if (imageFiles.length === 0) {
            container.innerHTML = "<p style='color: #888;'>&gt; No hay assets en la carpeta todavía.</p>";
            return;
        }

        // Crear dinámicamente las tarjetas estilo Pinterest por cada imagen encontrada
        imageFiles.forEach(file => {
            const card = document.createElement("div");
            card.className = "pin-card";

            card.innerHTML = `
                <img src="${file.download_url}" alt="${file.name}">
                <div class="pin-overlay">
                    <span>&gt; ${file.name}</span>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error:", error);
        container.innerHTML = "<p style='color: #ff5500;'>&gt; ERROR: No se pudieron cargar los assets automáticamente.</p>";
    }
});