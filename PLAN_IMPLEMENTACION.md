# 🚀 Task Manager Pro - Plan de Implementación Detallado

## 📋 Índice
1. [Sistema de Ordenamiento](#fase-1-sistema-de-ordenamiento)
2. [Notificaciones de Vencimiento](#fase-2-notificaciones-de-vencimiento)
3. [Drag and Drop](#fase-3-drag-and-drop)

---

## 🎯 Fase 1: Sistema de Ordenamiento

### Paso 1.1: Actualizar el Store de Zustand

**Archivo:** `src/Store/taskStore.js`

**Qué hacer:**
1. Agregar dos nuevos estados al store:
```javascript
sortBy: 'none', // Opciones: 'none', 'date', 'priority', 'alphabetical'
sortOrder: 'asc', // Opciones: 'asc' (ascendente), 'desc' (descendente)
```

2. Crear dos nuevas acciones:
```javascript
// Cambiar el tipo de ordenamiento
setSortBy: (sortType) => set({ sortBy: sortType }),

// Alternar entre ascendente y descendente
toggleSortOrder: () => set((state) => ({
  sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc'
}))
```

**Verificación:** Guardar el archivo y asegurarte de que no haya errores en la consola.

---

### Paso 1.2: Crear Componente SortControls

**Crear estructura:**
```
src/components/SortControls/
  ├── SortControls.jsx
  └── SortControls.module.css
```

**Archivo:** `SortControls.jsx`

**Contenido básico:**
```javascript
import useTaskStore from "../../Store/taskStore.js";
import styles from "./SortControls.module.css";

export default function SortControls() {
  const sortBy = useTaskStore((state) => state.sortBy);
  const sortOrder = useTaskStore((state) => state.sortOrder);
  const setSortBy = useTaskStore((state) => state.setSortBy);
  const toggleSortOrder = useTaskStore((state) => state.toggleSortOrder);

  return (
    <div className={styles.sortControls}>
      <label>Ordenar por:</label>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="none">Sin ordenar</option>
        <option value="date">Fecha de vencimiento</option>
        <option value="priority">Prioridad</option>
        <option value="alphabetical">Alfabético (A-Z)</option>
      </select>
      
      {sortBy !== 'none' && (
        <button onClick={toggleSortOrder}>
          {sortOrder === 'asc' ? '↑ Ascendente' : '↓ Descendente'}
        </button>
      )}
    </div>
  );
}
```

**Archivo:** `SortControls.module.css`

**Estilos básicos:**
```css
.sortControls {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.sortControls label {
  font-weight: 500;
  color: var(--text-primary);
}

.sortControls select {
  padding: 0.5rem 1rem;
  border: 2px solid var(--border);
  border-radius: 6px;
  font-size: 0.95rem;
}

.sortControls button {
  padding: 0.5rem 1rem;
  background: var(--primary);
  color: white;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
}

.sortControls button:hover {
  background: var(--secondary);
}
```

---

### Paso 1.3: Implementar Lógica de Ordenamiento

**Archivo:** `src/components/TaskList/TaskList.jsx`

**Agregar función de ordenamiento:**
```javascript
// Al inicio del componente, después de obtener las tareas filtradas
const sortBy = useTaskStore((state) => state.sortBy);
const sortOrder = useTaskStore((state) => state.sortOrder);

// Función para ordenar tareas
const sortTasks = (tasks) => {
  if (sortBy === 'none') return tasks;
  
  const sorted = [...tasks].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'date') {
      const dateA = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
      const dateB = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');
      comparison = dateA - dateB;
    } 
    else if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
    } 
    else if (sortBy === 'alphabetical') {
      comparison = a.title.localeCompare(b.title);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  return sorted;
};

// Aplicar ordenamiento DESPUÉS de filtrar
const sortedTasks = sortTasks(filteredTasks);

// En el return, mapear sortedTasks en lugar de filteredTasks
```

---

### Paso 1.4: Integrar en la UI Principal

**Archivo:** `src/App.jsx`

**Agregar el componente:**
```javascript
import SortControls from "./components/SortControls/SortControls.jsx";

// Dentro del return, después de FilterBar:
<FilterBar />
<SortControls />
<TaskList />
```

---

### Paso 1.5: Pruebas del Ordenamiento

**Lista de verificación:**
- [X] Crear 3-4 tareas con diferentes fechas
- [X] Seleccionar "Fecha de vencimiento" y verificar orden
- [X] Hacer clic en el botón ascendente/descendente
- [X] Crear tareas con prioridades alta, media, baja
- [X] Seleccionar "Prioridad" y verificar orden
- [X] Crear tareas con nombres: "Zebra", "Apple", "Mango"
- [X] Seleccionar "Alfabético" y verificar orden
- [X] Recargar la página y verificar que persista

---

## 🔔 Fase 2: Notificaciones de Vencimiento

### Paso 2.1: Crear Hook de Notificaciones

**Crear carpeta:** `src/hooks/`

**Archivo:** `src/hooks/useNotifications.js`

**Contenido completo:**
```javascript
import { useEffect } from 'react';
import useTaskStore from '../Store/taskStore';

export default function useNotifications() {
  const tasks = useTaskStore((state) => state.tasks);

  // Solicitar permiso de notificaciones
  const requestPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  // Verificar si una tarea vence pronto (< 24 horas)
  const isTaskDueSoon = (dueDate) => {
    if (!dueDate) return false;
    
    const now = new Date();
    const due = new Date(dueDate);
    const hoursUntilDue = (due - now) / (1000 * 60 * 60);
    
    return hoursUntilDue > 0 && hoursUntilDue <= 24;
  };

  // Enviar notificación
  const sendNotification = (task) => {
    if (Notification.permission === 'granted') {
      new Notification('⚠️ Tarea Próxima a Vencer', {
        body: `"${task.title}" vence pronto`,
        icon: '/favicon.ico',
        tag: task.id // Evita duplicados
      });
    }
  };

  // Verificar tareas al montar y cada hora
  useEffect(() => {
    requestPermission();

    const checkTasks = () => {
      tasks.forEach((task) => {
        if (!task.completed && isTaskDueSoon(task.dueDate)) {
          sendNotification(task);
        }
      });
    };

    checkTasks(); // Verificar inmediatamente
    const interval = setInterval(checkTasks, 60 * 60 * 1000); // Cada hora

    return () => clearInterval(interval);
  }, [tasks]);
}
```

---

### Paso 2.2: Integrar Hook en App

**Archivo:** `src/App.jsx`

**Agregar:**
```javascript
import useNotifications from './hooks/useNotifications';

export default function App() {
  useNotifications(); // Llamar el hook
  
  // ... resto del código
}
```

---

### Paso 2.3: Agregar Indicadores Visuales

**Archivo:** `src/components/TaskItem/TaskItem.jsx`

**Agregar función helper:**
```javascript
const isTaskDueSoon = (dueDate) => {
  if (!dueDate) return false;
  const now = new Date();
  const due = new Date(dueDate);
  const hoursUntilDue = (due - now) / (1000 * 60 * 60);
  return hoursUntilDue > 0 && hoursUntilDue <= 24;
};

const isDueSoon = isTaskDueSoon(task.dueDate);
```

**Modificar el contenedor principal:**
```javascript
<div className={`${styles.taskItemContainer} ${isDueSoon ? styles.urgent : ''}`}>
```

**Agregar icono en el título:**
```javascript
<h3>
  {isDueSoon && <span className={styles.urgentIcon}>⚠️</span>}
  {task.title}
</h3>
```

**Archivo:** `TaskItem.module.css`

**Agregar estilos:**
```css
.urgent {
  border-color: #ef4444 !important;
  background: #fef2f2;
}

.urgentIcon {
  margin-right: 0.5rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

### Paso 2.4: Pruebas de Notificaciones

**Lista de verificación:**
- [ ] Crear tarea con fecha de mañana
- [ ] Verificar que aparezca icono ⚠️
- [ ] Verificar que el borde sea rojo
- [ ] Esperar a que aparezca notificación del navegador
- [ ] Crear tarea con fecha de dentro de 2 días (no debe notificar)
- [ ] Denegar permiso y verificar que no crashee
- [ ] Probar en Chrome
- [ ] Probar en Firefox
- [ ] Probar en Edge

---

## 🎨 Fase 3: Drag and Drop

### Paso 3.1: Instalar Dependencias

**Abrir terminal en el proyecto y ejecutar:**
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Verificar instalación:**
- Abrir `package.json`
- Buscar las tres librerías en `dependencies`

---

### Paso 3.2: Actualizar Store con Reordenamiento

**Archivo:** `src/Store/taskStore.js`

**Agregar acción:**
```javascript
// Reordenar tareas manualmente
reorderTasks: (startIndex, endIndex) => set((state) => {
  const result = Array.from(state.tasks);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return { tasks: result };
})
```

---

### Paso 3.3: Hacer TaskList Draggable

**Archivo:** `src/components/TaskList/TaskList.jsx`

**Imports necesarios:**
```javascript
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
```

**Obtener acción del store:**
```javascript
const reorderTasks = useTaskStore((state) => state.reorderTasks);
const sortBy = useTaskStore((state) => state.sortBy);
```

**Función handleDragEnd:**
```javascript
const handleDragEnd = (event) => {
  const { active, over } = event;
  
  if (active.id !== over.id) {
    const oldIndex = filteredTasks.findIndex((task) => task.id === active.id);
    const newIndex = filteredTasks.findIndex((task) => task.id === over.id);
    reorderTasks(oldIndex, newIndex);
  }
};
```

**Envolver el return:**
```javascript
// Solo permitir drag si no hay ordenamiento activo
const isDragDisabled = sortBy !== 'none';

return (
  <div className={styles.filteredTaskContainer}>
    {isDragDisabled && (
      <p className={styles.dragDisabledMessage}>
        Desactiva el ordenamiento para reordenar manualmente
      </p>
    )}
    
    <DndContext 
      collisionDetection={closestCenter} 
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={filteredTasks.map(t => t.id)} 
        strategy={verticalListSortingStrategy}
        disabled={isDragDisabled}
      >
        {filteredTasks.map((task) => (
          <TaskItem task={task} key={task.id} isDragDisabled={isDragDisabled} />
        ))}
      </SortableContext>
    </DndContext>
  </div>
);
```

---

### Paso 3.4: Hacer TaskItem Sortable

**Archivo:** `src/components/TaskItem/TaskItem.jsx`

**Imports:**
```javascript
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
```

**Modificar función del componente:**
```javascript
export default function TaskItem({ task, isDragDisabled }) {
  // ... código existente ...
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id, disabled: isDragDisabled });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  
  // ... resto del código ...
```

**Modificar el contenedor principal:**
```javascript
<div 
  ref={setNodeRef}
  style={style}
  className={`${styles.taskItemContainer} ${isDueSoon ? styles.urgent : ''}`}
>
  {!isDragDisabled && (
    <span className={styles.dragHandle} {...attributes} {...listeners}>
      ⋮⋮
    </span>
  )}
  
  {/* resto del contenido */}
</div>
```

---

### Paso 3.5: Estilizar Drag Handle

**Archivo:** `TaskItem.module.css`

**Agregar estilos:**
```css
.dragHandle {
  cursor: grab;
  font-size: 1.2rem;
  color: var(--text-secondary);
  padding: 0.5rem;
  user-select: none;
}

.dragHandle:active {
  cursor: grabbing;
}

.dragHandle:hover {
  color: var(--primary);
}
```

---

### Paso 3.6: Pruebas de Drag and Drop

**Lista de verificación:**
- [ ] Arrastrar tarea hacia arriba
- [ ] Arrastrar tarea hacia abajo
- [ ] Soltar y verificar que cambie el orden
- [ ] Recargar página y verificar que persista
- [ ] Activar ordenamiento y verificar que se deshabilite drag
- [ ] Verificar mensaje "Desactiva el ordenamiento..."
- [ ] Desactivar ordenamiento y verificar que vuelva drag
- [ ] Probar con filtros activos
- [ ] Probar en móvil (touch)

---

## 🚀 Fase 4: Despliegue Final

### Paso 4.1: Commit y Push a GitHub

**Comandos:**
```bash
git add .
git commit -m "feat: agregar ordenamiento, notificaciones y drag-and-drop"
git push origin main
```

---

### Paso 4.2: Verificar Despliegue en Vercel

**Pasos:**
1. Ir a [vercel.com](https://vercel.com)
2. Esperar a que termine el despliegue automático (1-2 min)
3. Abrir tu URL: https://task-manager-pro-eight.vercel.app/
4. Probar todas las nuevas características
5. Probar desde el celular

---

## ✅ Checklist Final de Verificación

- [ ] Ordenamiento funciona correctamente
- [ ] Notificaciones se muestran para tareas urgentes
- [ ] Drag and drop permite reordenar
- [ ] Todo persiste al recargar
- [ ] Funciona en producción (Vercel)
- [ ] Funciona en móvil
- [ ] No hay errores en consola
