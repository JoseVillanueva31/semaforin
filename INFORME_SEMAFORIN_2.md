# Semaforín 2.0 — Informe de implementación

## 1. Diagnóstico de la versión original

La versión recibida era una aplicación estática sin framework ni dependencias de npm, compuesta por `index.html`, `style.css` y `script.js`. Registraba evaluaciones con asignatura, nombre y fecha; las guardaba en `localStorage` bajo `semaforin_evaluaciones`; calculaba la semana comenzando el lunes y clasificaba la carga en verde (0–1), amarillo (2–3) y rojo (4+). No existían edición, estado completado, tipos de evaluación, calendario, avisos internos ni bloques de estudio.

También se detectó texto con codificación rota en la interfaz original. No se encontró `package.json`, configuración de build, workflow de GitHub Actions ni carpeta `.git` en esta copia, por lo que el despliegue disponible corresponde a una página estática que puede abrirse directamente en GitHub Pages.

## 2. Mejoras implementadas

- Rediseño visual lavanda/morado, tarjetas redondeadas, jerarquía tipográfica, estados vacíos, sombras suaves y diseño responsive.
- Navegación por tres vistas: Resumen, Calendario y Plan de estudio.
- Panel resumen con evaluaciones pendientes, próxima evaluación, completadas y bloques pendientes.
- Gestión completa de evaluaciones: crear, editar, eliminar con confirmación y marcar como completadas.
- Campo de tipo de evaluación: Prueba, Trabajo, Presentación, Control u Otro.
- Semáforo semanal con los umbrales originales y textos explicativos; la carga no depende solo del color.
- Avisos dentro de la aplicación para evaluaciones de los próximos 7 días y confirmación visual de acciones.
- Calendario mensual y semanal, navegación entre periodos, selección de día y detalle de evaluaciones.
- Plan de estudio con bloques fechados, duración, completar y eliminar.
- Persistencia compatible: se conserva `semaforin_evaluaciones`; se agregan campos opcionales sin borrar datos anteriores. Los bloques usan `semaforin_bloques_estudio`.
- HTML semántico, etiquetas asociadas, foco visible, navegación por botones y mensajes `aria-live`.

## 3. Funcionalidades pendientes

- No se implementaron notificaciones del sistema, correo ni recordatorios fuera de la aplicación: la arquitectura estática no ofrece un servicio confiable para ello.
- No se agregó backend, autenticación ni base de datos, porque no son necesarios para el alcance actual y podrían complicar GitHub Pages.
- No se creó `feature/semaforin-2.0`: la carpeta entregada no contiene un repositorio Git ni historial desde el que crear una rama. Para cumplirlo, abre el proyecto desde su repositorio original y crea la rama allí antes de hacer commit.

## 4. Archivos modificados

- `index.html`: estructura completa, vistas, formularios y diálogos.
- `style.css`: sistema visual y responsive.
- `script.js`: estado, persistencia, gestión de evaluaciones, calendario, avisos y bloques de estudio.
- `INFORME_SEMAFORIN_2.md`: este reporte.

## 5. Revisión final: estado real

| Área | Estado | Evidencia / alcance |
|---|---|---|
| HTML, CSS y JavaScript conectados | Verificado estáticamente | `index.html` referencia `style.css` y `script.js`; no hay rutas absolutas locales ni `fetch`/imports internos. Ambos archivos están en la raíz. |
| Navegación | Implementada; verificación visual pendiente | Los botones cambian entre `inicio`, `calendario` y `estudio`, y el hash permite abrir una vista. No se ejecutó clic real en navegador por bloqueo de la herramienta visual. |
| Calendario | Implementado; verificación visual pendiente | Vista mensual/semanal, navegación de periodo, selección de día y detalle. Revisado por código. |
| Edición y eliminación | Implementada; confirmación visual pendiente | Editar actualiza el mismo `id`; eliminar requiere `confirm`. Revisado por código, no ejecutado en navegador. |
| Recordatorios | Implementados dentro de la aplicación | Se listan evaluaciones pendientes de los próximos 7 días. No son notificaciones del sistema. |
| Semáforo | Implementado | Mantiene 0–1 verde, 2–3 amarillo y 4+ rojo; agrupa por semanas iniciadas el lunes y añade texto. Revisado por código. |
| Plan de estudio | Implementado; verificación visual pendiente | Crear, completar y eliminar bloques con fecha y duración. Revisado por código. |
| `localStorage` | Revisado y reforzado | Se conserva `semaforin_evaluaciones`; se agregan campos sin borrar registros válidos. La lectura ahora tolera JSON inválido, estructuras no-array y registros incompletos. No se usa `removeItem` ni `clear`. |
| GitHub Pages | Compatible por arquitectura | Solo usa archivos estáticos y rutas relativas. No hay build ni dependencia local obligatoria. La fuente Google Fonts es externa y puede omitirse si se requiere modo offline. |
| Móvil | Implementado en CSS; verificación visual pendiente | Breakpoints a 800px y 450px, navegación desplazable y grids adaptables. No se pudo capturar una prueba visual. |
| Accesibilidad básica | Revisada por código | `lang`, etiquetas de formulario, `aria-label`, `aria-live`, botones semánticos y foco visible. Falta auditoría con lector de pantalla. |

### Pruebas efectivamente ejecutadas

- `node --check script.js`: exitoso, sin errores de sintaxis.
- Auditoría estática de recursos: `style.css` y `script.js` están referenciados desde `index.html`; no se detectaron rutas absolutas locales, `fetch` ni imports internos.
- Auditoría estática de selectores: no se detectaron IDs usados por JavaScript que falten en HTML.
- Auditoría de persistencia: solo se observan `getItem` y `setItem`; no se observan `removeItem` ni `clear`.
- Búsqueda de repositorio original cercano: no se encontraron carpetas `.git`, remotos ni referencias a `github.com` en la carpeta del proyecto ni en su carpeta padre inmediata.
- Prueba visual/funcional con navegador: no realizada. La herramienta disponible se detuvo porque no pudo determinar la URL activa de Chrome con suficiente confianza.

## 6. Ejecución

Abre `index.html` directamente en un navegador moderno, o sirve la carpeta con cualquier servidor estático local. No hay instalación de dependencias ni proceso de compilación.

### Validación manual recomendada antes de presentar

1. Abre `index.html`, recarga y confirma que aparecen Resumen, Calendario y Plan de estudio sin errores en la consola.
2. Crea una evaluación con fecha futura; confirma que aparece en la agenda, resumen, calendario y próxima evaluación.
3. Edita asignatura, nombre, tipo y fecha; recarga la página y confirma que los cambios permanecen.
4. Marca la evaluación como completada y confirma que cambia el panel; prueba reabrirla.
5. Elimina una evaluación y verifica la confirmación y su desaparición tras recargar.
6. Crea cuatro evaluaciones en la misma semana: debe aparecer una semana de carga alta. Repite con 2–3 y 0–1 para validar los tres umbrales.
7. En Calendario, cambia Mes/Semana, navega con ‹/›, selecciona un día con evaluación y revisa el detalle.
8. Crea un bloque de estudio, márcalo completado, recarga y confirma que su estado persiste.
9. Prueba una ventana móvil aproximada de 390px y otra de 768px; confirma que no hay desplazamiento horizontal ni controles cortados.
10. Navega usando solo teclado: `Tab`, `Enter` y `Escape`; comprueba que el foco sea visible y que los diálogos puedan cerrarse.
11. En DevTools → Application → Local Storage, verifica que `semaforin_evaluaciones` no se elimina y que `semaforin_bloques_estudio` contiene solo los bloques creados.

## 7. Publicación en GitHub Pages

Desde el repositorio Git original:

1. Crea o cambia a `feature/semaforin-2.0`.
2. Revisa los cambios y haz commit.
3. Haz push solo cuando corresponda y abre un Pull Request hacia la rama configurada para Pages.
4. En Settings → Pages, selecciona la rama y la carpeta raíz (`/root`) si el repositorio publica desde una rama.

No se hizo push ni publicación desde esta sesión.

### Flujo exacto cuando se localice el repositorio original

```powershell
git clone <URL_DEL_REPOSITORIO_ORIGINAL>
Set-Location <CARPETA_CLONADA>
git switch -c feature/semaforin-2.0
# Copiar aquí los cuatro archivos de esta entrega y revisar los cambios
git diff --check
git add index.html style.css script.js INFORME_SEMAFORIN_2.md
git commit -m "feat: mejora Semaforín 2.0"
git push -u origin feature/semaforin-2.0
```

Después, configura GitHub Pages según el flujo del repositorio original y abre un Pull Request. No uses `git init` en esta copia mientras no se confirme la URL original.

## 8. Riesgos y limitaciones

- `localStorage` es local al navegador y dispositivo; limpiar datos del navegador elimina la agenda.
- La tipografía se importa desde Google Fonts; si se requiere funcionamiento totalmente offline, conviene reemplazarla por una pila local.
- Antes de una validación académica se recomienda probar manualmente alta/edición/eliminación, persistencia tras recarga, calendario mensual/semanal y tamaños móviles.
