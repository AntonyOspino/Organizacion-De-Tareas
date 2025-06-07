# 📌 Organización de Tareas  
Sistema de gestión de tareas con **recordatorios en tiempo real**, utilizando **JavaScript** y **Supabase** para manejar la base de datos.  

## 🚀 Características  
- ✅ **Gestión de tareas**: Crear, editar y eliminar tareas con fechas y horas de recordatorio.  
- ✅ **Notificaciones en tiempo real**: Usa la API de notificaciones del navegador para avisos automáticos.  
- ✅ **Formato de fecha optimizado**: Convierte fechas a formato **DD/MM/YYYY HH:MM AM/PM** para mejor visualización.  
- ✅ **Base de datos Supabase**: Guarda y gestiona las tareas en la nube.  

---

## 🛠️ Instalación y ejecución  

### **1️⃣ Clonar el repositorio**  
Ejecuta en tu terminal:  

```bash
git clone https://github.com/AntonyOspino/Organizacion-De-Tareas.git
cd organizacion-de-tareas
2️⃣ Configurar Supabase
Crea un proyecto en Supabase

Obtén la URL y la API Key desde la configuración de tu proyecto.

Edita el archivo config.js en la raíz del proyecto e ingresa tus credenciales:

js
const SUPABASE_URL = "TU_SUPABASE_URL";
const SUPABASE_API_KEY = "TU_SUPABASE_API_KEY";
export { SUPABASE_URL, SUPABASE_API_KEY };
📌 Nota: Este archivo debe estar incluido en .gitignore para evitar que tus credenciales sean públicas en GitHub.

3️⃣ Ejecutar el proyecto
Abre index.html en tu navegador

Ejecuta el proyecto en localhost (http://127.0.0.1:5500).

Habilita las notificaciones al cargar la página.

⚙️ Estructura del proyecto
📂 organizacion-de-tareas
 ├── 📜 index.html   # Página principal
 ├── 📜 style.css    # Estilos del sistema
 ├── 📜 main.js      # Código principal de gestión de tareas
 ├── 📜 config.js    # Configuración de Supabase (ignorado en Git)
 ├── 📜 .gitignore   # Ignora archivos sensibles como `config.js`
 ├── 📜 README.md    # Documento con instrucciones del proyecto

🔗 Recursos adicionales
📌 Supabase Docs: Supabase 📌 Notificaciones Web API: Mozilla Developer

## page
https://antonyospino.github.io/Organizacion-De-Tareas/

👨‍💻 Contribuciones
Si deseas mejorar este sistema, haz un fork del repositorio y envía un pull request con tus cambios. ¡Toda colaboración es bienvenida!
