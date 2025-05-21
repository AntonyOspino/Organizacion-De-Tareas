// importamos config
import { SUPABASE_URL, SUPABASE_KEY } from "./config.js";

// Create a single supabase client for interacting with your database
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Capturar el boton de historial de registros
const historialBtn = document.getElementById("historialBtn");
const modalHistorial = document.getElementById("modalHistorial");
const cerrarModal = document.getElementById("cerrarModal");
const listaRegistros = document.getElementById("lista-registros");

// Capturar el botón flotante y el modal
const btnAgregarTarea = document.getElementById("btnAgregarTarea");
const modalAgregar = document.getElementById("modalAgregar");
const cerrarModalAgregar = document.getElementById("cerrarModalAgregar");

// Capturar el contenedor de tareas
const listaTareas = document.getElementById("lista-tareas");

// capturamos el h2 arria del contenedor de tareas este se cambiara dinamicamente
// dependiendo de lo que seleccionemos en el select
const tituloTareas = document.getElementById("tareas-guardadas");

// Capturar el select del filtro
const filtroSelect = document.getElementById("filtro");

// Capturar elementos del modal de confirmacion de eliminacion
const modalConfirmacion = document.getElementById("modalConfirmacion");
const btnCancelar = document.getElementById("btnCancelar");
const btnConfirmar = document.getElementById("btnConfirmar");

///////////////////////////////////////////////////////////////////////////////////***/

// Mostrar el modal al hacer clic en "Historial"
historialBtn.addEventListener("click", async () => {
  await obtenerRegistros(); // Cargar los registros antes de abrir el modal
  modalHistorial.style.display = "flex";
});

// Cerrar el modal cuando se haga clic en la "X"
cerrarModal.addEventListener("click", () => {
  modalHistorial.style.display = "none";
});

// Mostrar el modal al hacer clic en "+"
btnAgregarTarea.addEventListener("click", () => {
  modalAgregar.style.display = "flex"; // Muestra el modal
});

// Cerrar el modal cuando se haga clic en la "X"
cerrarModalAgregar.addEventListener("click", () => {
  modalAgregar.style.display = "none"; // Oculta el modal
});

// Detectar cambios en el select y filtrar tareas
filtroSelect.addEventListener("change", () => {
  const categoriaSeleccionada = filtroSelect.value;
  console.log(categoriaSeleccionada);
  // Definir los títulos según la categoría
  const titulos = {
    Todos: "Tareas Guardadas",
    Personal: "Tareas Personales",
    Trabajo: "Tareas de Trabajo",
    Estudio: "Tareas de Estudio",
  };

  // Cambiar el contenido del h2 según la categoría seleccionada
  tituloTareas.textContent =
    titulos[categoriaSeleccionada] || "Tareas Guardadas";

  // Llamamos a la funcion para obtener las tareas y mostrarlas
  obtenerTareas(categoriaSeleccionada);
});

// Detectar clic en el botón "Completado"
document.addEventListener("click", async (event) => {
  if (event.target.classList.contains("btn-completado")) {
    const tareaId = event.target.getAttribute("data-id");

    // Actualizar la tarea en Supabase
    const { error } = await supabase
      .from("tareas")
      .update({ status: "completado" })
      .eq("id", tareaId);

    if (error) {
      console.error("Error al marcar como completado:", error);
    } else {
      obtenerTareas(); // Refrescar lista de tareas
    }
  }
});

let tareaAEliminar = null; // Variable para almacenar la tarea seleccionada

// Mostrar el modal cuando se haga clic en "Eliminar"
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-eliminar")) {
    tareaAEliminar = event.target.getAttribute("data-id"); // Guardar el ID de la tarea
    modalConfirmacion.style.display = "flex"; // Mostrar el modal
  }
});

// Cancelar eliminación y ocultar el modal
btnCancelar.addEventListener("click", () => {
  tareaAEliminar = null; // Resetear la variable
  modalConfirmacion.style.display = "none";
});

// confirmar la eliminacion de la tarea llamando a la funcion que hace este proceso
btnConfirmar.addEventListener("click", () => {
  if (!tareaAEliminar) {
    alert("tarea no seleccionada");
    return;
  } // Verificar que haya tarea seleccionada
  eliminarTarea(tareaAEliminar); // Llamar a la función que ejecuta la eliminación
});

// Toma los datos del formulario y los envia a (f)insertarTarea
document
  .getElementById("formAgregarTarea")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Evitar que el formulario recargue la página

    // Obtener los valores ingresados por el usuario
    const titulo = document.getElementById("titulo").value;
    const categoria = document.getElementById("categoria").value;
    const descripcion = document.getElementById("descripcion").value;
    const recordatorio = document.getElementById("recordatorio").value;

    // Llamar a la función para insertar la tarea en Supabase
    await insertarTarea(titulo, categoria, descripcion, recordatorio);

    // Limpiar el formulario después de enviar
    this.reset();

    // Ocultar el modal después de guardar la tarea
    // document.getElementById("modalAgregar").style.display = "none";
  });

/////////////////////////////////////////////////////////////////////////***/

async function obtenerTareas(categoria = "Todos") {
  listaTareas.innerHTML = ""; // Limpiar lista antes de cargar datos

  // Filtrar tareas según la categoría seleccionada
  let query = supabase.from("tareas").select("*");

  if (categoria !== "Todos") {
    query = query.eq("category", categoria);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error al obtener tareas:", error);
    return;
  }

  // Crear cada tarea como un `<li>` dentro del ul
  data.forEach((tarea) => {
    const item = document.createElement("li");
    item.innerHTML = `
            <strong>${tarea.title}</strong> <br>
            📝 Descripción: ${tarea.description} <br>
            🔹 Estado: ${tarea.status} <br>
            📌 Categoría: ${tarea.category} <br>
            ⏰ Recordatorio: ${
              tarea.reminder_at ? formatData(tarea.reminder_at) : "No asignado"
            } <br>
            <button class="btn-completado" data-id="${
              tarea.id
            }">✅ Completado</button>
            <button class="btn-eliminar" data-id="${
              tarea.id
            }">❌ Eliminar</button>
        `;
    listaTareas.appendChild(item);
  });
}

async function obtenerRegistros() {
  listaRegistros.innerHTML = ""; // Limpiar lista antes de cargar datos

  const { data, error } = await supabase
    .from("registros")
    .select(
      "id, title, description, status, category, created_at, reminder_at, deleted_at"
    );

  if (error) {
    console.error("Error al obtener registros:", error);
    return;
  }

  // Crear elementos `<li>` con toda la información del registro
  data.forEach((registro) => {
    const item = document.createElement("li");
    item.innerHTML = `
            <strong>${registro.title}</strong> <br>
            📝 Descripción: ${registro.description} <br>
            🔹 Estado: ${registro.status} <br>
            📌 Categoría: ${registro.category} <br>
            📅 Creado: ${convertirFechaUTCColombia(registro.created_at)} <br>
            ⏰ Recordatorio: ${
              registro.reminder_at
                ? formatData(registro.reminder_at)
                : "No asignado"
            } <br>
            ❌ Eliminado: ${
              registro.deleted_at
                ? convertirFechaUTCColombia(registro.deleted_at)
                : "Aun Activo"
            }
        `;
    listaRegistros.appendChild(item);
  });
}

//funcion que elimina de la tabla tareas el registro
async function eliminarTarea(id) {
  const { error } = await supabase.from("tareas").delete().eq("id", id);

  if (error) {
    console.error("Error al eliminar tarea:", error);
    return;
  }

  alert("Tarea Eliminada");
  obtenerTareas(); // Refrescar lista de tareas después de eliminar
  modalConfirmacion.style.display = "none"; // Ocultar modal
  tareaAEliminar = null; // Resetear la variable
}

async function insertarTarea(titulo, categoria, descripcion, recordatorio) {
  const { error } = await supabase
    .from("tareas")
    .insert([
      {
        title: titulo,
        category: categoria,
        description: descripcion,
        status: "pendiente",
        reminder_at: recordatorio,
      },
    ]);

  if (error) {
    console.error("Error al insertar tarea:", error);
    return;
  }

  console.log(`Tarea ${titulo} insertada correctamente!`);

  // Refrescar la lista de tareas después de agregar una nueva
  obtenerTareas();
}

function formatData(dateString) {
  // Extraer solo la fecha y la hora sin cambiar la zona horaria
  const date = new Date(dateString);

  // Obtener fecha en formato "DD/MM/YYYY"
  const formattedDate = date
    .toISOString()
    .split("T")[0]
    .split("-")
    .reverse()
    .join("/");

  // Extraer la hora correctamente sin alterar UTC
  let [hours, minutes] = dateString.split("T")[1].split(":"); // Obtiene las horas y minutos directamente
  const period = hours < 12 ? "AM" : "PM";
  hours = hours % 12 || 12; // Convertir a formato de 12 horas

  return `${formattedDate} ${hours}:${minutes} ${period}`;
}

function convertirFechaUTCColombia(fechaUTC) {
  const date = new Date(fechaUTC);

  // Verificar si la fecha es válida antes de intentar convertirla
  if (isNaN(date.getTime())) {
    return "Fecha inválida";
  }

  // Convertir desde UTC a la hora local de Colombia (`UTC-5`)
  const opciones = {
    timeZone: "America/Bogota", // Ajuste correcto de zona horaria
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Formato 12h con AM/PM
  };

  return new Intl.DateTimeFormat("es-CO", opciones).format(date);
}

/////////////////////////////////////////////////////////////////////////////////***/

// Llamar a la función para cargar tareas al iniciar la página
obtenerTareas();
