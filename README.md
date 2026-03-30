# Icaria Gestor de Tareas

Aplicación de gestión de tareas desarrollada como prueba técnica para Icaria Technology.

## Requisitos previos

- Usar Angular 21
- Usar TypeScript
- Usar componentes standalone
- Implementar routing
- Usar formularios reactivos
- Manejar datos con un servicio local, datos mock o JSON
- No es necesario backend real
- Incluir un README.md con:
  - instrucciones de ejecución
  - decisiones técnicas tomadas
  - supuestos realizados

## Instrucciones de ejecución

Clona el repositorio e instala las dependencias:

```bash
git clone <url-del-repositorio>
cd icaria-gestor-tareas
npm install
```

Levanta el servidor de desarrollo:

```bash
ng serve
```

Abre el navegador en `http://localhost:4200`.

## Funcionalidades implementadas

### Requisitos obligatorios

- Listado de tareas con tabla paginada (título, descripción, prioridad, estado y fecha límite)
- Filtrado por título en tiempo real, por estado y por prioridad
- Ordenación por fecha límite, estado y prioridad con lógica personalizada
- Creación de tareas con validaciones (título obligatorio, prioridad obligatoria, fecha válida)
- Edición de tareas existentes mediante el mismo formulario reutilizable
- Cambio rápido de estado a "completada" desde el listado sin abrir el formulario
- Vista de detalle de tarea en la ruta `/tasks/:id`
- Resumen de métricas: total de tareas, pendientes, completadas y vencidas

### Bonus implementados

- Lazy loading en todas las rutas
- Estado vacío con mensaje informativo cuando no hay tareas --> no comprobable porque no se pueden eliminar tareas
- Uso de signals en toda la aplicación

## Decisiones técnicas

### Arquitectura del proyecto

He seguido una estructura modular dividida en tres capas: `core` para la lógica de negocio sin UI, `features` para las funcionalidades principales de la app y `shared` para componentes reutilizables. Esta separación facilita el mantenimiento y la escalabilidad del proyecto, y es la estructura que he seguido en otros proyectos de Digital, por lo que para mi es la arquitectura más sencilla para navegar por el proyecto.

### Angular 21 con componentes standalone

He usado componentes standalone en toda la aplicación, ahora por defecto los componentes siempre lo son sin necesidad de añadir standalone: true.

### Signals y computed en lugar de RxJS

He optado por signals para la gestión del estado, aprovechando la reactividad nativa de Angular 21 sin necesidad de RxJS o NgRx como. Decisiones concretas:

- El signal de tareas es `private` para que solo el servicio pueda modificarlo. Solo el servicio puede crear y updatear tareas (si se diera la posibilidad de eliminar tareas también se eliminarían desde el servicio).
- Se expone con `asReadonly()` para que los componentes puedan leerlo sin mutarlo. Así nos aseguramos que el cliente NO pueda modificar directamente las tareas, si no que es el servicio, consiguiendo un bajo acoplamiento.
- `computed()` recalcula automáticamente las métricas del resumen cuando cambia el estado
- `effect()` en el formulario reacciona a los cambios del input `task` para rellenar o limpiar el formulario según el modo

### PrimeNG para la tabla y otros componentes

He decidido usar PrimeNG para `p-table` y algunos otros componentes (`p-tag`, `p-button`, `p-select`, `p-datepicker`, `p-dialog`), aprovechando el sistema de filtrado y ordenación integrado que tiene PrimeNG. Además, en la Job Description incluísteis que usais esta librería para evitar crear componentes complejos para vuestra migración. De esta forma voy aprendiendo a utilizar y entender esta librería.

### Ordenación personalizada con customSort

La ordenación por prioridad y estado requiere un orden lógico (`low → medium → high`, `pending → in_progress → done`) en lugar de alfabético que viene por defecto. Se ha implementado `customSort` con mapas de orden numérico que también mantiene la ordenación estándar para el resto de columnas.

### Formulario reactivo reutilizable en un Dialog

Se ha creado un único `TaskFormComponent` que funciona tanto para creación como para edición, controlado mediante inputs (`task`, `visible`) y outputs (`saved`, `cancelled`). Esto evita duplicar código y centraliza las validaciones. El formulario se presenta en un Dialog de PrimeNG para no abandonar el contexto del listado.

### Lazy loading de rutas

Todas las rutas usan `loadComponent` con imports dinámicos. El componente solo se descarga cuando el usuario navega a esa ruta, reduciendo el bundle inicial.

### Gestión del estado vacío

La app arranca con 15 tareas mock para facilitar la evaluación, pero el estado vacío está contemplado con un mensaje informativo en la tabla y el componente summary mostrando ceros. A pesar de que esto no se puede ver debido a que no se ha implementado la funcionalidad de eliminar tareas, hay una forma de verlo y es buscando tareas por nombre que no contengan el string que se esté escribiendo

## Supuestos realizados

- No se ha implementado persistencia de datos. Las tareas se almacenan en memoria y se pierden al recargar la página, ya que la prueba no requiere backend real.
- Se incluyen 15 tareas mock como datos de ejemplo para facilitar la evaluación de la aplicación.
- Una tarea se considera vencida cuando su fecha límite es estrictamente anterior al día de hoy, sin contar el día actual.
- El campo descripción no es obligatorio ya que no se especifica en los requisitos.
- No se ha implementado eliminación de tareas ya que no está contemplada en los requisitos.
- El campo estado en el formulario de creación tiene `Pendiente` como valor por defecto, ya que es el estado lógico inicial de cualquier tarea nueva.
