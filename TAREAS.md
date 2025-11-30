# 📋 Task Manager Pro - Lista de Tareas

## ✅ Completadas
- [x] Configurar estructura de carpetas del proyecto
- [x] Implementar el Store con Zustand (`taskStore.js`)

---

## 🎯 Tarea 1: Crear el Componente TaskForm
**Ubicación:** `src/components/TaskForm.jsx`

**Objetivo:** Crear un formulario para agregar nuevas tareas

**Requisitos:**
- [X] Crear un formulario con un input para el título de la tarea
- [X] Agregar un botón para enviar el formulario
- [X] Usar el hook `useTaskStore` para acceder a la función `addTask`
- [X] Al enviar, crear un objeto tarea con:
  - `title`: el texto del input
- [X] Limpiar el input después de agregar la tarea
- [X] Validar que el input no esté vacío antes de agregar

**Pista:** 
```javascript
const addTask = useTaskStore((state) => state.addTask);
```

---

## 🎯 Tarea 2: Crear el Componente TaskItem
**Ubicación:** `src/components/TaskItem.jsx`

**Objetivo:** Mostrar una tarea individual con sus acciones

**Requisitos:**
- [X] Recibir una tarea como prop
- [X] Mostrar el título de la tarea
- [X] Mostrar un checkbox para marcar como completada
- [X] Agregar un botón para eliminar la tarea
- [X] Usar `toggleTask` cuando se haga clic en el checkbox
- [X] Usar `deleteTask` cuando se haga clic en el botón eliminar
- [ ] Aplicar estilos diferentes si la tarea está completada (ej: texto tachado)

**Pista:**
```javascript
const { toggleTask, deleteTask } = useTaskStore();
```

---

## 🎯 Tarea 3: Crear el Componente TaskList
**Ubicación:** `src/components/TaskList.jsx`

**Objetivo:** Mostrar la lista de tareas filtradas

**Requisitos:**
- [X] Usar `useTaskStore` para obtener `getFilteredTasks`
- [X] Llamar a `getFilteredTasks()` para obtener las tareas a mostrar
- [X] Mapear las tareas y renderizar un `TaskItem` por cada una
- [X] Mostrar un mensaje si no hay tareas ("No hay tareas")
- [X] Pasar la tarea completa como prop a cada `TaskItem`

**Pista:**
```javascript
const getFilteredTasks = useTaskStore((state) => state.getFilteredTasks);
const filteredTasks = getFilteredTasks();
```

---

## 🎯 Tarea 4: Crear el Componente FilterBar
**Ubicación:** `src/components/FilterBar.jsx`

**Objetivo:** Crear una barra con filtros y búsqueda

**Requisitos:**
- [X] Crear un input de búsqueda
- [X] Crear tres botones de filtro: "Todas", "Activas", "Completadas"
- [X] Usar `setSearchTerm` cuando cambie el input de búsqueda
- [X] Usar `setFilter` cuando se haga clic en los botones
- [X] Resaltar el filtro activo actual
- [X] Mostrar el contador de tareas activas
- [X] Agregar un botón "Limpiar completadas" que use `clearCompleted`

**Pista:**
```javascript
const { filter, searchTerm, setFilter, setSearchTerm, clearCompleted, tasks } = useTaskStore();
const activeTasks = tasks.filter(task => !task.completed).length;
```

---

## 🎯 Tarea 5: Integrar Todo en App.jsx
**Ubicación:** `src/App.jsx`

**Objetivo:** Ensamblar todos los componentes

**Requisitos:**
- [ ] Importar todos los componentes creados
- [ ] Estructurar la aplicación con un layout básico
- [ ] Agregar un título/header a la aplicación
- [ ] Renderizar `TaskForm` en la parte superior
- [ ] Renderizar `FilterBar` debajo del formulario
- [ ] Renderizar `TaskList` al final
- [ ] Asegurarte de que todo funcione correctamente

---

## 🎯 Tarea 6: Agregar Estilos (Opcional pero Recomendado)
**Ubicación:** `src/styles/` (crear archivos CSS según prefieras)

**Objetivo:** Hacer que la aplicación se vea bien

**Requisitos:**
- [ ] Crear estilos para cada componente
- [ ] Usar un diseño responsive
- [ ] Agregar colores y espaciado apropiado
- [ ] Hacer que los botones sean interactivos (hover, active)
- [ ] Estilizar las tareas completadas (tachado, opacidad)

---

## 📝 Notas Importantes

### Estructura de una Tarea:
```javascript
{
  id: "unique-id",
  title: "Título de la tarea",
  completed: false,
  createdAt: "2025-11-27T21:37:00.000Z"
}
```

### Cómo usar Zustand:
```javascript
// Opción 1: Obtener todo el estado
const { tasks, addTask, deleteTask } = useTaskStore();

// Opción 2: Obtener solo lo que necesitas (más eficiente)
const addTask = useTaskStore((state) => state.addTask);
const tasks = useTaskStore((state) => state.tasks);
```

---

## 🆘 ¿Necesitas Ayuda?

Si te atascas en alguna tarea:
1. Intenta buscar en la documentación de React/Zustand
2. Revisa el código del `taskStore.js` para entender las funciones
3. Si después de intentarlo necesitas ayuda, ¡escríbeme!

---

## 🎓 Consejos de tu Mentor

- **Trabaja de forma incremental**: Completa una tarea a la vez
- **Prueba cada componente**: Asegúrate de que funcione antes de pasar al siguiente
- **Usa console.log**: Para debuggear y entender qué está pasando
- **No te frustres**: Es normal atascarse, forma parte del aprendizaje
- **Experimenta**: Prueba cosas nuevas y aprende de los errores

¡Mucho éxito! 🚀
