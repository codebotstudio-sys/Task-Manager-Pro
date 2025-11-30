import useTaskStore from "../../Store/taskStore.js";
import TaskItem from "../TaskItem/TaskItem.jsx";
import styles from "./TaskList.module.css";

// Componente TaskList

export default function TaskList() {
    const tasks = useTaskStore((state) => state.tasks);
    const filter = useTaskStore((state) => state.filter);
    const searchTerm = useTaskStore((state) => state.searchTerm);
    const sortBy = useTaskStore((state) => state.sortBy);
    const sortOrder = useTaskStore((state) => state.sortOrder);

    // Filtrar aquí en el componente
    // Safety check: ensure tasks is an array
    let filteredTasks = Array.isArray(tasks) ? tasks : [];

    // Aplicar filtro de estado
    if (filter === "active") {
        filteredTasks = filteredTasks.filter((task) => !task.completed);
    } else if (filter === "completed") {
        filteredTasks = filteredTasks.filter((task) => task.completed);
    }

    // Aplicar búsqueda
    if (searchTerm) {
        filteredTasks = filteredTasks.filter((task) =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (filteredTasks.length === 0) {
        return <h3>No hay Tareas</h3>;
    }

    // funcion para Aplicar ordenamiento
    const sortTasks = (tasks) => {
        if (sortBy === "none") return tasks;

        const sorted = [...tasks].sort((a, b) => {
            let comparison = 0;

            if (sortBy === "date") {
                const dateA = a.dueDate ? new Date(a.dueDate) : new Date("9999-12-31");
                const dateB = b.dueDate ? new Date(b.dueDate) : new Date("9999-12-31");
                comparison = dateA - dateB;
            } else if (sortBy === "priority") {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
            } else if (sortBy === "alphabetical") {
                comparison = a.title.localeCompare(b.title);
            }

            return sortOrder === "asc" ? comparison : -comparison;
        });

        return sorted;
    };

    // Aplicar ordenamiento
    filteredTasks = sortTasks(filteredTasks);

    return (
        <div className={styles.filteredTaskContainer}>
            {filteredTasks.map((task) => (
                <TaskItem task={task} key={task.id} />
            ))}
        </div>
    );
}