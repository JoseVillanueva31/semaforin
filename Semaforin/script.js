"use strict";

// 1. Recuperar evaluaciones guardadas
let evaluaciones = JSON.parse(
  localStorage.getItem("semaforin_evaluaciones") || "[]",
);

// 2. Conectar JavaScript con HTML
const formulario = document.getElementById("formulario-evaluacion");
const lista = document.getElementById("lista-evaluaciones");
const semaforo = document.getElementById("semaforo-semanal");
const total = document.getElementById("total-evaluaciones");
const proxima = document.getElementById("proxima-evaluacion");

// Convertir una fecha YYYY-MM-DD a fecha local
function convertirFecha(fecha) {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  return new Date(anio, mes - 1, dia);
}

// Formatear fechas para mostrarlas
function mostrarFecha(fecha) {
  return convertirFecha(fecha).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Guardar datos en el navegador
function guardarEvaluaciones() {
  localStorage.setItem("semaforin_evaluaciones", JSON.stringify(evaluaciones));
}

// 3. Agregar evaluaciones
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const asignatura = document.getElementById("asignatura").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const fecha = document.getElementById("fecha").value;

  if (!asignatura || !nombre || !fecha) {
    alert("Completa todos los campos.");
    return;
  }

  const evaluacion = {
    id: crypto.randomUUID(),
    asignatura,
    nombre,
    fecha,
  };

  evaluaciones.push(evaluacion);
  guardarEvaluaciones();
  actualizarPantalla();

  formulario.reset();
});

// 4. Eliminar evaluaciones
function eliminarEvaluacion(id) {
  if (!confirm("¿Deseas eliminar esta evaluación?")) {
    return;
  }

  evaluaciones = evaluaciones.filter((evaluacion) => evaluacion.id !== id);

  guardarEvaluaciones();
  actualizarPantalla();
}

// 5. Calcular inicio de semana (lunes)
function obtenerInicioSemana(fechaTexto) {
  const fecha = convertirFecha(fechaTexto);
  const dia = fecha.getDay();

  const diferencia = dia === 0 ? -6 : 1 - dia;
  fecha.setDate(fecha.getDate() + diferencia);

  return fecha;
}

// 6. Determinar color según cantidad
function obtenerCarga(cantidad) {
  if (cantidad <= 1) {
    return { color: "verde", texto: "Carga baja" };
  }

  if (cantidad <= 3) {
    return { color: "amarillo", texto: "Carga media" };
  }

  return { color: "rojo", texto: "Carga alta" };
}

// 7. Actualizar resumen y próxima evaluación
function actualizarResumen() {
  total.textContent = evaluaciones.length;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const futuras = evaluaciones
    .filter((e) => convertirFecha(e.fecha) >= hoy)
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  if (futuras.length === 0) {
    proxima.textContent = "Sin evaluaciones próximas";
  } else {
    const siguiente = futuras[0];

    proxima.textContent =
      siguiente.asignatura +
      " - " +
      siguiente.nombre +
      " (" +
      mostrarFecha(siguiente.fecha) +
      ")";
  }
}

// 8. Mostrar evaluaciones registradas
function actualizarLista() {
  lista.innerHTML = "";

  if (evaluaciones.length === 0) {
    lista.textContent = "Todavía no has agregado evaluaciones.";
    return;
  }

  const ordenadas = [...evaluaciones].sort((a, b) =>
    a.fecha.localeCompare(b.fecha),
  );

  ordenadas.forEach((evaluacion) => {
    const elemento = document.createElement("div");
    elemento.className = "evaluacion";

    const informacion = document.createElement("p");
    const nombre = document.createElement("strong");

    nombre.textContent = evaluacion.asignatura + " - " + evaluacion.nombre;

    informacion.appendChild(nombre);
    informacion.appendChild(document.createElement("br"));
    informacion.appendChild(
      document.createTextNode(mostrarFecha(evaluacion.fecha)),
    );

    const boton = document.createElement("button");
    boton.textContent = "Eliminar";
    boton.type = "button";

    boton.addEventListener("click", () => {
      eliminarEvaluacion(evaluacion.id);
    });

    elemento.appendChild(informacion);
    elemento.appendChild(boton);
    lista.appendChild(elemento);
  });
}

// 9. Agrupar evaluaciones por semana
function actualizarSemaforo() {
  semaforo.innerHTML = "";

  if (evaluaciones.length === 0) {
    semaforo.textContent = "Aún no hay evaluaciones registradas.";
    return;
  }

  const semanas = {};

  evaluaciones.forEach((evaluacion) => {
    const inicio = obtenerInicioSemana(evaluacion.fecha);

    const clave =
      inicio.getFullYear() +
      "-" +
      String(inicio.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(inicio.getDate()).padStart(2, "0");

    if (!semanas[clave]) {
      semanas[clave] = [];
    }

    semanas[clave].push(evaluacion);
  });

  Object.keys(semanas)
    .sort()
    .forEach((clave) => {
      const cantidad = semanas[clave].length;
      const carga = obtenerCarga(cantidad);

      const inicio = convertirFecha(clave);
      const fin = new Date(inicio);
      fin.setDate(fin.getDate() + 6);

      const tarjeta = document.createElement("div");
      tarjeta.className = "semana " + carga.color;

      const titulo = document.createElement("h3");
      titulo.textContent =
        "Semana del " +
        inicio.toLocaleDateString("es-CL") +
        " al " +
        fin.toLocaleDateString("es-CL");

      const descripcion = document.createElement("p");
      descripcion.textContent =
        carga.texto + " - " + cantidad + " evaluación(es)";

      tarjeta.appendChild(titulo);
      tarjeta.appendChild(descripcion);

      semanas[clave].forEach((evaluacion) => {
        const detalle = document.createElement("p");
        detalle.textContent =
          "• " +
          evaluacion.asignatura +
          ": " +
          evaluacion.nombre +
          " (" +
          mostrarFecha(evaluacion.fecha) +
          ")";

        tarjeta.appendChild(detalle);
      });

      semaforo.appendChild(tarjeta);
    });
}

// 10. Actualizar toda la aplicación
function actualizarPantalla() {
  actualizarResumen();
  actualizarLista();
  actualizarSemaforo();
}

// Cargar información al abrir Semaforín
actualizarPantalla();
