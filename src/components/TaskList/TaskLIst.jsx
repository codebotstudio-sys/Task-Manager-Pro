import useTaskStore from "../../Store/taskStore.js";
import TaskItem from "../TaskItem/TaskItem.jsx";
import styles from "./TaskList.module.css";

export default function TaskList() {
    const tasks = useTaskStore((state) => state.tasks);
    const filter = useTaskStore((state) => state.filter);
    const searchTerm = useTaskStore((state) => state.searchTerm);

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

    return (
        <div className={styles.filteredTaskContainer}>
            {filteredTasks.map((task) => (
                <TaskItem task={task} key={task.id} />
            ))}
        </div>
    );
}