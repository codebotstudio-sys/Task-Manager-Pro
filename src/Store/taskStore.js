import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTaskStore = create(
  persist(
    (set) => ({
      tasks: [], // Array de tareas
      filter: "all", // 'all', 'active', 'completed'
      searchTerm: "", // String para buscar tareas
      sortBy: "none",//'none', 'date', 'priority', 'alphabetical'
      sortOrder: "asc",// 'asc' (ascendente), 'desc' (descendente)

      // ========== ACCIONES CRUD ==========

      // Agregar una nueva tarea
      addTask: (taskData) => set((state) => ({
        tasks: [...state.tasks, { ...taskData, id: Date.now() + Math.random(), completed: false, createdAt: new Date() }]
      })),

      // Eliminar una tarea por ID
      deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId)
      })),

      // Alternar el estado completado de una tarea
      toggleTask: (taskId) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      })),

      // Actualizar una tarea existente
      updateTask: (taskId, updatedData) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, ...updatedData } : task
        )
      })),

      // Cambiar el filtro actual
      setFilter: (filter) => set({ filter }),

      // Actualizar el término de búsqueda
      setSearchTerm: (searchTerm) => set({ searchTerm }),

      // Limpiar tareas completadas
      clearCompleted: () => set((state) => ({
        tasks: state.tasks.filter((task) => !task.completed)
      })),

      // Cambiar el tipo de ordenamiento
      setSortBy: (sortType) => set({ sortBy: sortType }),

      // Alternar el orden ascendente/descendente
      toggleSortOrder: () => set((state) => ({
        sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc'
      })),
    }),
    {
      name: "task-storage", // unique name for localStorage
    }
  )
);

export default useTaskStore;