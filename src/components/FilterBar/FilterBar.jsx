import useTaskStore from "../../Store/taskStore.js";
import styles from "./FilterBar.module.css";

export default function FilterBar() {
    const setSearchTerm = useTaskStore((state) => state.setSearchTerm);
    const setFilter = useTaskStore((state) => state.setFilter);
    const filter = useTaskStore((state) => state.filter);
    const tasks = useTaskStore((state) => state.tasks);
    const clearCompleted = useTaskStore(state => state.clearCompleted);

    return (
        <div className={styles.filterBarContainer}>
            <input
                type="text"
                placeholder="Search tasks..."
                className={styles.searchInput}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className={styles.filterButtons}>
                <button
                    className={filter === "all" ? `${styles.filterButton} ${styles.filterButtonActive}` : styles.filterButton}
                    onClick={() => setFilter("all")}
                >
                    All
                </button>
                <button
                    className={filter === "active" ? `${styles.filterButton} ${styles.filterButtonActive}` : styles.filterButton}
                    onClick={() => setFilter("active")}
                >
                    Active
                </button>
                <button
                    className={filter === "completed" ? `${styles.filterButton} ${styles.filterButtonActive}` : styles.filterButton}
                    onClick={() => setFilter("completed")}
                >
                    Completed
                </button>
            </div>

            <div className={styles.statsContainer}>
                <div className={styles.activeTasks}>
                    Active Tasks: {tasks.filter((task) => !task.completed).length}
                </div>
                <button
                    className={styles.clearButton}
                    onClick={() => clearCompleted()}
                >
                    Clear Completed
                </button>
            </div>
        </div>
    );
}